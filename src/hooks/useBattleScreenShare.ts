import { useState, useEffect, useCallback, useRef } from 'react';
import { localStream as sharedLocalStream, setLocalStream, peerConnection as sharedPC, setPeerConnection, setRemoteStream } from '@/utils/webrtcStore';
import useWebSocketStore from '@/stores/websocketStore';
import { useNavigate } from 'react-router-dom';

interface UseBattleScreenShareProps {
  isGameFinished: boolean;
  isRemoteStreamActive: boolean;
  setIsGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
  createPeerConnection: () => RTCPeerConnection;
  // BattlePage.tsx에서 전달되는 추가 속성들
  setLocalStream: (stream: MediaStream | null) => void;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setIsRemoteStreamActive: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRemoteScreenSharePrompt: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useBattleScreenShare = ({
  isGameFinished,
  isRemoteStreamActive,
  setIsGamePaused,
  createPeerConnection,
  // BattlePage.tsx에서 전달되는 추가 속성들 구조 분해 할당
  setLocalStream,
  setPeerConnection,
  setRemoteStream,
  setIsRemoteStreamActive,
  setShowRemoteScreenSharePrompt,
}: UseBattleScreenShareProps) => {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocketStore();

  const [isLocalStreamActive, setIsLocalStreamActive] = useState(true);
  const [showLocalScreenSharePrompt, setShowLocalScreenSharePrompt] = useState(false);
  const [showScreenShareRequiredModal, setShowScreenShareRequiredModal] = useState(false);
  const [screenShareCountdown, setScreenShareCountdown] = useState(0);
  const screenShareCountdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupScreenShare = useCallback(() => {
    if (sharedLocalStream) {
      sharedLocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsLocalStreamActive(false);
      setShowLocalScreenSharePrompt(true);
      sendMessage(JSON.stringify({ type: 'screen_share_stopped' }));
    }
    // Peer Connection 정리 추가
    if (sharedPC) {
      sharedPC.close();
      setPeerConnection(null);
    }
  }, [sendMessage, setLocalStream, setIsLocalStreamActive, setShowLocalScreenSharePrompt, sharedPC, setPeerConnection]);

  const startLocalScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setLocalStream(stream);
      setIsLocalStreamActive(true);
      setShowLocalScreenSharePrompt(false);
      setShowScreenShareRequiredModal(false); // 화면 공유 재시작 성공 시 모달 닫기
      if (screenShareCountdownIntervalRef.current) {
        clearInterval(screenShareCountdownIntervalRef.current);
      }
      if (isRemoteStreamActive) {
        setIsGamePaused(false); // 두 사용자가 모두 공유 중일 때만 게임 재개
      }

      // localVideoRef는 BattlePage에 있으므로 여기서 직접 접근 불가. BattlePage에서 srcObject 설정

      let pc = sharedPC;
      if (!pc) {
        pc = createPeerConnection();
      }

      // 기존 트랙 제거
      pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'video') {
          pc.removeTrack(sender);
        }
      });

      // 새 트랙 추가
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendMessage(JSON.stringify({ type: 'renegotiate_screen_share' })); // 화면 공유 재시작 시 재협상 메시지 전송
      sendMessage(JSON.stringify({ type: 'webrtc_signal', signal: pc.localDescription }));
      sendMessage(JSON.stringify({ type: 'screen_share_started' })); // 화면 공유 재시작 메시지 전송

      stream.getVideoTracks()[0].onended = () => {
        cleanupScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
      setShowLocalScreenSharePrompt(true);
    }
  }, [createPeerConnection, sendMessage, cleanupScreenShare, isRemoteStreamActive, setIsGamePaused, setLocalStream, setIsLocalStreamActive, setShowLocalScreenSharePrompt, setShowScreenShareRequiredModal, screenShareCountdownIntervalRef]); // 의존성 추가

  // If the page was refreshed and the local stream is lost, prompt the user to
  // restart screen sharing.
  useEffect(() => {
    if (!sharedLocalStream && !showScreenShareRequiredModal && !isGameFinished) {
      setShowScreenShareRequiredModal(true);
      setScreenShareCountdown(60);
      if (screenShareCountdownIntervalRef.current) {
        clearInterval(screenShareCountdownIntervalRef.current);
      }
      screenShareCountdownIntervalRef.current = setInterval(() => {
        setScreenShareCountdown(prev => {
          if (prev <= 1) {
            clearInterval(screenShareCountdownIntervalRef.current!); // 카운트다운 종료
            sendMessage(JSON.stringify({ type: 'match_result', reason: 'surrender' }));
            navigate('/result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIsGamePaused(true);
    }
  }, [sharedLocalStream, showScreenShareRequiredModal, isGameFinished, sendMessage, navigate, setIsGamePaused, setScreenShareCountdown, screenShareCountdownIntervalRef]); // 의존성 추가

  useEffect(() => {
    if (sharedLocalStream) {
      const videoTrack = sharedLocalStream.getVideoTracks()[0];
      if (videoTrack) {
        const handleEnded = () => {
          cleanupScreenShare();
        };
        videoTrack.onended = handleEnded;
        return () => {
          videoTrack.onended = null;
        };
      }
    }
  }, [sharedLocalStream, cleanupScreenShare]);

  useEffect(() => {
    return () => {
      if (screenShareCountdownIntervalRef.current) {
        clearInterval(screenShareCountdownIntervalRef.current);
      }
    };
  }, []);

  return {
    isLocalStreamActive,
    showLocalScreenSharePrompt,
    showScreenShareRequiredModal,
    setShowLocalScreenSharePrompt, 
    screenShareCountdown,
    cleanupScreenShare,
    startLocalScreenShare,
    setIsLocalStreamActive,
    setShowScreenShareRequiredModal,
    setScreenShareCountdown,
    screenShareCountdownIntervalRef,
  };
};