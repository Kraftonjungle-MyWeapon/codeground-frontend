import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocketStore from '@/stores/websocketStore';
import { localStream as sharedLocalStream, setLocalStream, peerConnection as sharedPC, setPeerConnection, setRemoteStream, remoteStream as sharedRemoteStream } from '@/utils/webrtcStore';

interface UseBattleModalsProps {
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
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
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
    setConfirmExitCallback(() => () => {
      cleanupScreenShare();
      sendMessage(JSON.stringify({ type: "match_result", reason: "surrender" }));
    });
    setCancelExitCallback(() => () => {
      setIsExitModalOpen(false);
    });
  }, [sendMessage, cleanupScreenShare]);

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

  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
    cleanupScreenShare();
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      navigate('/result');
    }
  }, [cleanupScreenShare, navigate, confirmNavigation]);

  const handleCancelSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
  }, []);

  const handleContinueAlone = useCallback(() => {
    setIsCheatDetectionActive(false); // 부정행위 감지 끄기
    setIsGamePaused(false); // 게임 일시정지 해제
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

  const handleSurrenderLeave = useCallback(() => {
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      const stored = sessionStorage.getItem('matchResult');
      if (stored) {
        navigate('/result', { state: { matchResult: JSON.parse(stored) } });
      } else {
        navigate('/result');
      }
    }
  }, [navigate, confirmNavigation]);

  const handleLeave = useCallback(() => {
    cleanupScreenShare();
    setShowOpponentLeftModal(false);
    if (confirmNavigation) {
      confirmNavigation();
    } else {
      navigate('/waiting-room');
    }
  }, [cleanupScreenShare, navigate, confirmNavigation]);

  return {
    isExitModalOpen,
    setIsExitModalOpen,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
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
    handleConfirmSubmit,
    handleCancelSubmit,
    handleContinueAlone,
    handleStay,
    handleSurrenderStay,
    handleSurrenderLeave,
    handleLeave,
  };
};
