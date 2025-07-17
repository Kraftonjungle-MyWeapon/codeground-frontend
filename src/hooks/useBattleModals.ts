import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocketStore from '@/stores/websocketStore';
import { localStream as sharedLocalStream, setLocalStream, peerConnection as sharedPC, setPeerConnection, setRemoteStream, remoteStream as sharedRemoteStream } from '@/utils/webrtcStore';

import { leaveRoom } from '@/utils/api';

interface UseBattleModalsProps {
  gameId: string | null;
  userId: number | undefined;
  matchType: string | null;
  cleanupScreenShare: () => void;
  setIsGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCheatDetectionActive: React.Dispatch<React.SetStateAction<boolean>>;
  setShowScreenShareRequiredModal: React.Dispatch<React.SetStateAction<boolean>>;
  screenShareCountdownIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  setIsRemoteStreamActive: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLocalScreenSharePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRemoteScreenSharePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  setShowScreenSharePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOpponentScreenShareRequiredModal: React.Dispatch<React.SetStateAction<boolean>>;
  reportCheating: (payload: any) => void; // Adjust payload type as needed
  // 추가된 속성들
  sharedLocalStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
  setIsLocalStreamActive: React.Dispatch<React.SetStateAction<boolean>>;
  sharedRemoteStream: MediaStream | null;
  setRemoteStream: (stream: MediaStream | null) => void;
  sharedPC: RTCPeerConnection | null;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  confirmNavigation?: () => void; // New prop
}

export const useBattleModals = ({
  gameId,
  userId,
  matchType,
  cleanupScreenShare,
  setIsGameFinished,
  setIsGamePaused,
  setIsCheatDetectionActive,
  setShowScreenShareRequiredModal,
  screenShareCountdownIntervalRef,
  remoteVideoRef,
  setIsRemoteStreamActive,
  setShowLocalScreenSharePrompt,
  setShowRemoteScreenSharePrompt,
  setShowScreenSharePrompt,
  setShowOpponentScreenShareRequiredModal,
  reportCheating,
  // 추가된 속성들 구조 분해 할당
  sharedLocalStream,
  setLocalStream,
  setIsLocalStreamActive,
  sharedRemoteStream,
  setRemoteStream,
  sharedPC,
  setPeerConnection,
  confirmNavigation, // confirmNavigation 추가
}: UseBattleModalsProps) => {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocketStore();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [confirmExitCallback, setConfirmExitCallback] = useState<(() => void) | null>(null);
  const [cancelExitCallback, setCancelExitCallback] = useState<(() => void) | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showOpponentLeftModal, setShowOpponentLeftModal] = useState(false);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const [isSolvingAlone, setIsSolvingAlone] = useState(false); // New state
  const isConfirmedExitRef = useRef(false); // New ref

  const handleReportClick = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const handleReportSubmit = useCallback((payload: any) => {
    reportCheating(payload);
    setIsReportModalOpen(false);
  }, [reportCheating]);

  const handleSurrenderButtonClick = useCallback(() => {
    setIsExitModalOpen(true);
    setConfirmExitCallback(() => async () => {
      // Call leave_room API for the surrendering player
      if (gameId && userId && matchType === 'custom') {
        try {
          await leaveRoom(Number(gameId), userId);
          console.log(`Player ${userId} successfully left room ${gameId} due to surrender.`);
        } catch (error) {
          console.error("Error leaving room on surrender:", error);
        }
      }

      // Send surrender message via WebSocket
      sendMessage(JSON.stringify({ type: "match_result", reason: "surrender" }));
      setIsExitModalOpen(false); // 모달 닫기
    });
    setCancelExitCallback(() => () => {
      setIsExitModalOpen(false); // 모달 닫기
    });
  }, [sendMessage, gameId, userId, matchType]);

  const handleConfirmExit = useCallback(() => {
    isConfirmedExitRef.current = true;
    setIsExitModalOpen(false);
    if (confirmExitCallback) {
      confirmExitCallback();
    }
  }, [confirmExitCallback, isConfirmedExitRef]);

  const handleCancelExit = useCallback(() => {
    setIsExitModalOpen(false);
    if (cancelExitCallback) {
      cancelExitCallback();
    }
  }, [cancelExitCallback]);

  

  const handleContinueAlone = useCallback((shouldUnpause: boolean = true) => {
    setIsCheatDetectionActive(false); // 부정행위 감지 끄기
    if (shouldUnpause) {
      setIsGamePaused(false); // 게임 일시정지 해제
    }
    setShowScreenShareRequiredModal(false); // 화면공유 요구 모달 끄기
    if (screenShareCountdownIntervalRef.current) {
      clearInterval(screenShareCountdownIntervalRef.current);
    }

    // 내 화면 공유 중지
    if (sharedLocalStream) {
      sharedLocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsLocalStreamActive(false); // 이 상태는 useBattleScreenShare에서 관리

    // 상대 화면 공유 중지
    if (sharedRemoteStream) {
      sharedRemoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsRemoteStreamActive(false); // 이 상태는 useBattleWebRTC에서 관리

    // 모든 화면 공유 관련 프롬프트 숨기기
    setShowLocalScreenSharePrompt(false); // 이 상태는 useBattleScreenShare에서 관리
    setShowRemoteScreenSharePrompt(false); // 이 상태는 useBattleWebRTC에서 관리
    setShowScreenSharePrompt(false); // 이 상태는 BattlePage에서 관리
    setShowOpponentScreenShareRequiredModal(false);

    // WebRTC 연결 종료
    if (sharedPC) {
      sharedPC.close();
      setPeerConnection(null);
    }

    setIsSolvingAlone(true); // 혼자 풀기 모드 활성화
  }, [setIsCheatDetectionActive, setIsGamePaused, setShowScreenShareRequiredModal, screenShareCountdownIntervalRef, sharedLocalStream, setLocalStream, setIsLocalStreamActive, sharedRemoteStream, setRemoteStream, remoteVideoRef, setIsRemoteStreamActive, setShowLocalScreenSharePrompt, setShowRemoteScreenSharePrompt, setShowScreenSharePrompt, sharedPC, setPeerConnection]);

  const handleStay = useCallback(() => {
    setShowOpponentLeftModal(false);
    handleContinueAlone();
  }, [handleContinueAlone]);

  const handleSurrenderStay = useCallback(() => {
    setShowSurrenderModal(false);
    handleContinueAlone();
  }, [handleContinueAlone]);

  const handleSurrenderLeave = useCallback(async () => {
    if (gameId && userId && matchType === 'custom') {
      try {
        await leaveRoom(Number(gameId), userId);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    }

    cleanupScreenShare(); // 화면 공유 정리 추가
    setIsGameFinished(true); // 게임 종료 상태 설정 추가
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      const stored = sessionStorage.getItem('matchResult');
      if (stored) {
        navigate('/result', { state: { matchResult: JSON.parse(stored), matchType: matchType } });
      } else {
        navigate('/result');
      }
    }
  }, [cleanupScreenShare, setIsGameFinished, navigate, confirmNavigation, gameId, userId, matchType]);

  const handleLeave = useCallback(async () => {
    if (gameId && userId && matchType === 'custom') {
      try {
        await leaveRoom(Number(gameId), userId);
        console.log(`Player ${userId} successfully left room ${gameId} via handleLeave.`);
      } catch (error) {
        console.error("Error leaving room on handleLeave:", error);
      }
    }
    cleanupScreenShare();
    setShowOpponentLeftModal(false);
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      navigate('/waiting-room');
    }
  }, [cleanupScreenShare, navigate, confirmNavigation, gameId, userId, matchType]);

  const [isCorrectAnswerModalOpen, setIsCorrectAnswerModalOpen] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  const openCorrectAnswerModal = useCallback((winner: boolean) => {
    setIsWinner(winner);
    setIsCorrectAnswerModalOpen(true);
    setIsGamePaused(true);
  }, [setIsGamePaused]);

  const handleCorrectAnswerStay = useCallback(() => {
    setIsCorrectAnswerModalOpen(false);
    setIsGameFinished(true);
    handleContinueAlone(false);
    setIsGamePaused(false); // 추가: 게임 일시 정지 해제
  }, [setIsGameFinished, handleContinueAlone, setIsGamePaused]);

  const handleCorrectAnswerLeave = useCallback(async () => {
    if (gameId && userId && matchType === 'custom') {
      try {
        await leaveRoom(Number(gameId), userId);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    }

    cleanupScreenShare();
    setIsGameFinished(true); // 게임 종료 상태 설정
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      const stored = sessionStorage.getItem('matchResult');
      if (stored) {
        navigate('/result', { state: { matchResult: JSON.parse(stored), matchType: matchType } });
      } else {
        navigate('/result');
      }
    }
  }, [cleanupScreenShare, navigate, confirmNavigation, matchType, gameId, userId]);

  return {
    isExitModalOpen,
    setIsExitModalOpen,
    confirmExitCallback,
    setConfirmExitCallback,
    cancelExitCallback,
    setCancelExitCallback,
    isReportModalOpen,
    setIsReportModalOpen,
    showOpponentLeftModal,
    setShowOpponentLeftModal,
    showSurrenderModal,
    setShowSurrenderModal,
    isSolvingAlone,
    isConfirmedExitRef,
    handleReportClick,
    handleReportSubmit,
    handleSurrenderButtonClick,
    handleConfirmExit,
    handleCancelExit,
    handleContinueAlone,
    handleStay,
    handleSurrenderStay,
    handleSurrenderLeave,
    handleLeave,
    isCorrectAnswerModalOpen,
    isWinner,
    openCorrectAnswerModal,
    handleCorrectAnswerStay,
    handleCorrectAnswerLeave,
  };
};
