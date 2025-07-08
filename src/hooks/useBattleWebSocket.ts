import { useEffect, useRef } from 'react';
import useWebSocketStore from '@/stores/websocketStore';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ProblemWithImages } from '@/types/codeEditor';

interface UseBattleWebSocketProps {
  gameId: string | null;
  handleSignal: (signal: any) => Promise<void>;
  setChatMessages: React.Dispatch<React.SetStateAction<{ user: string; message: string; type: 'chat' | 'system' }[]>>;
  setIsGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOpponentLeftModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSurrenderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemoteStreamActive: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRemoteScreenSharePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
  setShowScreenShareRequiredModal: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenShareCountdown: React.Dispatch<React.SetStateAction<number>>;
  screenShareCountdownIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setProblem: React.Dispatch<React.SetStateAction<ProblemWithImages | null>>;
  sendMessage: (message: string) => void;
  cleanupScreenShare: () => void;
  isLocalStreamActive: boolean;
  isRemoteStreamActive: boolean;
  setShowOpponentScreenShareRequiredModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpponentScreenShareCountdown: React.Dispatch<React.SetStateAction<number>>;
}

export const useBattleWebSocket = ({
  gameId,
  handleSignal,
  setChatMessages,
  setIsGameFinished,
  setShowOpponentLeftModal,
  setShowSurrenderModal,
  setIsRemoteStreamActive,
  setShowRemoteScreenSharePrompt,
  setIsGamePaused,
  setShowScreenShareRequiredModal,
  setScreenShareCountdown,
  screenShareCountdownIntervalRef,
  setProblem,
  sendMessage,
  cleanupScreenShare,
  isLocalStreamActive,
  isRemoteStreamActive,
  setShowOpponentScreenShareRequiredModal,
  setOpponentScreenShareCountdown,
}: UseBattleWebSocketProps) => {
  const { websocket, connect } = useWebSocketStore();
  const { user } = useUser();
  const navigate = useNavigate();

  const opponentScreenShareCountdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const wsUrl = apiUrl.startsWith('https')
    ? apiUrl.replace(/^https/, 'wss')
    : apiUrl.replace(/^http/, 'ws');

  useEffect(() => {
    const storedWebsocketUrl = localStorage.getItem('websocketUrl');
    let currentWsUrl: string | null = null;

    if (storedWebsocketUrl) {
      currentWsUrl = storedWebsocketUrl;
      console.log('BattlePage: Using stored WebSocket URL from localStorage:', currentWsUrl);
    } else if (user?.user_id && gameId) {
      currentWsUrl = `${wsUrl}/api/v1/game/ws/game/${gameId}?user_id=${user.user_id}`;
      console.log('BattlePage: Constructing WebSocket URL from gameId and userId:', currentWsUrl);
    } else {
      console.log('BattlePage: Cannot connect WebSocket. Missing gameId, userId, or stored URL.', { gameId, userId: user?.user_id });
      return;
    }

    // 이미 연결되어 있고, 연결된 URL이 현재 필요한 URL과 동일하다면 다시 연결하지 않음
    if (websocket && websocket.readyState === WebSocket.OPEN && websocket.url === currentWsUrl) {
      console.log('BattlePage: WebSocket already connected to the correct URL. Skipping connection attempt.');
      return;
    }

    // WebSocket이 없거나 닫힌 상태일 때만 연결 시도
    if (!websocket || websocket.readyState === WebSocket.CLOSED) {
      console.log('BattlePage: WebSocket not connected or closed. Attempting to connect.', currentWsUrl);
      connect(currentWsUrl);
    }
  }, [websocket, user, gameId, connect, wsUrl]);

  useEffect(() => {
    if (!websocket) return;

    websocket.onopen = () => {
      console.log('BattlePage WebSocket connected');
      sendMessage(
        JSON.stringify({ type: 'webrtc_signal', signal: { type: 'join' } })
      );
    };

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat' && data.sender !== user.user_id) {
          setChatMessages((prev) => [
            ...prev,
            {
              user: '상대',
              message: data.message,
              type: 'chat',
            },
          ]);
        } else if (data.type === 'webrtc_signal' && data.sender !== user.user_id) {
          await handleSignal(data.signal);
        } else if (data.type === 'system_warning') {
          const isMe = data.user_id === user.user_id;
          const subject = isMe ? '나' : '상대방';
          const eventText = data.event === 'tab_hidden' ? '화면을 벗어났습니다' : '마우스가 화면 밖으로 나갔습니다';
          const message = `경고: ${subject}${isMe ? '가' : '이'} ${eventText}. (경고 ${data.count}/5)`;

          setChatMessages((prev) => [
            ...prev,
            {
              user: '시스템',
              message: message,
              type: 'system',
            },
          ]);
        } else if (data.type === 'match_result') {
          console.log('BattlePage: Match result received:', data);
          try {
            localStorage.setItem('matchResult', JSON.stringify(data));
            if (data.reason === 'surrender' && data.winner === user.user_id) {
              setIsGameFinished(true);
              setShowSurrenderModal(true);
            } else {
              navigate('/result', { state: { matchResult: data } });
            }
          } catch (e) {
            console.error('BattlePage: Failed to save match result or navigate:', e);
          }
        } else if (data.type === 'game_over') {
          navigate('/result');
        } else if (data.type === 'opponent_left') {
          setIsGameFinished(true);
          setShowOpponentLeftModal(true);
          setChatMessages((prev) => [
            ...prev,
            {
              user: '시스템',
              message: '상대방이 게임을 떠났습니다.',
              type: 'system',
            },
          ]);
        } else if (data.type === 'opponent_rejoined') {
          console.log('Received opponent_rejoined message:', data);
          setShowOpponentLeftModal(false);
          setIsRemoteStreamActive(false);
          setShowRemoteScreenSharePrompt(true);
          setIsGamePaused(true);
          setShowOpponentScreenShareRequiredModal(true);
          setChatMessages((prev) => [
            ...prev,
            {
              user: '시스템',
              message: '상대방이 다시 연결되었습니다.',
              type: 'system',
            },
          ]);
        } else if (data.type === 'screen_share_stopped') {
          console.log("Received screen_share_stopped message:", data);
          const isMe = data.user_id === user.user_id;
          console.log("isMe:", isMe, "data.user_id:", data.user_id, "user.user_id:", user.user_id);
          setChatMessages((prev) => [
            ...prev,
            {
              user: '시스템',
              message: isMe ? '내 화면 공유가 중지되었습니다.' : '상대방 화면 공유가 중지되었습니다.',
              type: 'system',
            },
          ]);
          if (!isMe) {
            setIsRemoteStreamActive(false);
            setShowRemoteScreenSharePrompt(true);
            setIsGamePaused(true); // 상대방 화면 공유 중단 시 게임 일시 정지
            setShowOpponentScreenShareRequiredModal(true);
            setOpponentScreenShareCountdown(60); // 1분 (60초) 카운트다운 시작
            if (opponentScreenShareCountdownIntervalRef.current) {
              clearInterval(opponentScreenShareCountdownIntervalRef.current);
            }
            opponentScreenShareCountdownIntervalRef.current = setInterval(() => {
              setOpponentScreenShareCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(opponentScreenShareCountdownIntervalRef.current!); // 카운트다운 종료
                  sendMessage(JSON.stringify({ type: "match_result", reason: "surrender" }));
                  navigate('/result');
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            // 자신이 화면 공유를 중지한 경우
            console.log("Setting showScreenShareRequiredModal to true.");
            setShowScreenShareRequiredModal(true);
            setScreenShareCountdown(60); // 1분 (60초) 카운트다운 시작
            if (screenShareCountdownIntervalRef.current) {
              clearInterval(screenShareCountdownIntervalRef.current);
            }
            screenShareCountdownIntervalRef.current = setInterval(() => {
              setScreenShareCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(screenShareCountdownIntervalRef.current!); // 카운트다운 종료
                  // 1분 안에 화면 공유를 다시 시작하지 않으면 항복 처리
                  sendMessage(JSON.stringify({ type: "match_result", reason: "surrender" }));
                  navigate('/result'); // 결과 페이지로 이동
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            setIsGamePaused(true); // 자신의 화면 공유 중단 시 게임 일시 정지
          }
        } else if (data.type === 'screen_share_started') {
          console.log("Received screen_share_started message:", data);
          const isMe = data.user_id === user.user_id;
          setChatMessages((prev) => [
            ...prev,
            {
              user: '시스템',
              message: isMe ? '내 화면 공유가 재개되었습니다.' : '상대방 화면 공유가 재개되었습니다.',
              type: 'system',
            },
          ]);
          if (!isMe) {
            if (opponentScreenShareCountdownIntervalRef.current) {
              clearInterval(opponentScreenShareCountdownIntervalRef.current);
            }
            setShowOpponentScreenShareRequiredModal(false);
            setIsRemoteStreamActive(true);
            setShowRemoteScreenSharePrompt(false);
            if (isLocalStreamActive) {
              setIsGamePaused(false); // 두 사용자가 모두 공유 중일 때만 게임 재개
            }
          } else {
            // 자신이 화면 공유를 재개한 경우 (서버로부터의 확인 메시지)
            if (screenShareCountdownIntervalRef.current) {
              clearInterval(screenShareCountdownIntervalRef.current);
            }
            setShowScreenShareRequiredModal(false);
            if (isRemoteStreamActive) { // isRemoteStreamActive는 이 훅의 범위 밖에 있음
              setIsGamePaused(false); // 두 사용자가 모두 공유 중일 때만 게임 재개
            }
          }
        } else if (data.type === 'match_accepted') {
          if (data.problem) {
            setProblem(data.problem);
            console.log("Problem received via WebSocket:", data.problem);
          } else {
            console.error("WebSocket: 'match_accepted' message received but data.problem is missing or null.", data);
          }
        }
      } catch (e) {
        console.error('BattlePage: ws message parse error', e);
      }
    };

  }, [websocket, user, handleSignal, navigate, setChatMessages, setIsGameFinished, setShowOpponentLeftModal, setIsRemoteStreamActive, setShowRemoteScreenSharePrompt, setIsGamePaused, setShowScreenShareRequiredModal, setScreenShareCountdown, screenShareCountdownIntervalRef, setProblem, sendMessage, cleanupScreenShare, isLocalStreamActive, isRemoteStreamActive, setShowOpponentScreenShareRequiredModal, setOpponentScreenShareCountdown]);

  useEffect(() => {
    return () => {
      if (opponentScreenShareCountdownIntervalRef.current) {
        clearInterval(opponentScreenShareCountdownIntervalRef.current);
      }
    };
  }, []);

  return {}; // 이 훅은 주로 사이드 이펙트를 처리하므로 반환할 것이 없음
};
