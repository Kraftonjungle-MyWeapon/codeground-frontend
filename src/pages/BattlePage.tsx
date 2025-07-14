import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import {
  Clock,
  Play,
  Monitor,
  Flag,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import {
  localStream as sharedLocalStream,
  remoteStream as sharedRemoteStream,
  setLocalStream,
  peerConnection as sharedPC,
  setPeerConnection,
  setRemoteStream,
} from "@/utils/webrtcStore";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ProblemWithImages, ProgrammingLanguage } from "@/types/codeEditor";
import { getLanguageConfig } from "@/utils/languageConfig";
import { CodeEditorHandler } from "@/utils/codeEditorHandlers";
import usePreventNavigation from "@/hooks/usePreventNavigation";
import GameExitModal from "@/components/GameExitModal";
import SubmitConfirmModal from "@/components/SubmitConfirmModal";
import useWebSocketStore from "@/stores/websocketStore";
import { authFetch } from "@/utils/api";
import useCheatDetection, { ReportPayload } from "@/hooks/useCheatDetection";
import ReportModal from "@/components/ReportModal";
import { OpponentLeftModal } from "@/components/OpponentLeftModal";
import { OpponentSurrenderModal } from "@/components/OpponentSurrenderModal";
import { ScreenShareRequiredModal } from "@/components/ScreenShareRequiredModal";
import { CorrectAnswerModal } from "@/components/CorrectAnswerModal";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/vs2015.css";
import { useToast } from "@/components/ui/use-toast"; // useToast 임포트

// Custom Hooks
import { useBattleWebRTC } from "@/hooks/useBattleWebRTC";
import { useBattleWebSocket } from "@/hooks/useBattleWebSocket";
import { useBattleScreenShare } from "@/hooks/useBattleScreenShare";
import { useBattleTimer } from "@/hooks/useBattleTimer";
import { useBattleChat } from "@/hooks/useBattleChat";
import { useBattleCodeEditor } from "@/hooks/useBattleCodeEditor";
import { useBattleProblem } from "@/hooks/useBattleProblem.tsx";
import BattleProblemPanel from "@/components/BattleProblemPanel";
import BattleChatPanel from "@/components/BattleChatPanel";
import BattleRemoteVideoPanel from "@/components/BattleRemoteVideoPanel";
import BattleCodeEditorPanel from "@/components/BattleCodeEditorPanel";
import { useBattleModals } from "@/hooks/useBattleModals";

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.startsWith('https')
    ? apiUrl.replace(/^https/, 'wss')
    : apiUrl.replace(/^http/, 'ws');

hljs.registerLanguage("python", python);

const BattlePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const { websocket, sendMessage, disconnect, connect } = useWebSocketStore();
  const { toast } = useToast(); // useToast 훅 사용

  // Refs that remain in BattlePage
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States that remain in BattlePage
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isCheatDetectionActive, setIsCheatDetectionActive] = useState(true);
  const [currentLanguage] = useState<ProgrammingLanguage>("python");
  const [showScreenSharePrompt, setShowScreenSharePrompt] = useState(false);
  const [showOpponentScreenShareRequiredModal, setShowOpponentScreenShareRequiredModal] = useState(false);
  const [opponentScreenShareCountdown, setOpponentScreenShareCountdown] = useState(0);

  // gameId 유효성 검사 및 리다이렉트
  useEffect(() => {
    const storedGameId = sessionStorage.getItem("gameId");
    if (!storedGameId) {
      toast({
        title: "잘못된 접근",
        description: "유효한 게임 정보가 없습니다. 홈으로 이동합니다.",
        variant: "destructive",
      });
      navigate("/home");
    }
  }, [navigate, toast]);

  // Custom Hook Calls
  const { reportCheating } = useCheatDetection({
    gameId,
    remoteVideoRef,
    containerRef,
    isActive: isCheatDetectionActive,
  });

  const {
    isRemoteStreamActive,
    setIsRemoteStreamActive,
    showRemoteScreenSharePrompt,
    setShowRemoteScreenSharePrompt,
    createPeerConnection,
    handleSignal,
  } = useBattleWebRTC({
    isGameFinished,
    remoteVideoRef,
    sharedLocalStream,
  });

  const {
    isLocalStreamActive,
    showLocalScreenSharePrompt,
    showScreenShareRequiredModal,
    screenShareCountdown,
    cleanupScreenShare,
    startLocalScreenShare,
    setIsLocalStreamActive,
    setShowLocalScreenSharePrompt, // 이 부분 추가
    setShowScreenShareRequiredModal,
    setScreenShareCountdown,
    screenShareCountdownIntervalRef,
  } = useBattleScreenShare({
    isGameFinished,
    isRemoteStreamActive,
    setIsGamePaused,
    createPeerConnection,
    setLocalStream, // Passed from webrtcStore
    setPeerConnection, // Passed from webrtcStore
    setRemoteStream, // Passed from webrtcStore
    setIsRemoteStreamActive, // Passed from BattlePage
    setShowRemoteScreenSharePrompt, // Passed from BattlePage
  });

  const { timeLeft, setTimeLeft } = useBattleTimer({
    isGamePaused,
    isGameFinished,
  });

  const {
    chatMessages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    chatEndRef,
    setChatMessages,
  } = useBattleChat();

  const { problem, problemId, renderDescription, setProblem } =
    useBattleProblem();

  const {
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
  } = useBattleModals({
    cleanupScreenShare,
    setIsGameFinished,
    setIsGamePaused,
    setIsCheatDetectionActive,
    setShowScreenShareRequiredModal,
    screenShareCountdownIntervalRef,
    sharedLocalStream,
    setLocalStream,
    setIsLocalStreamActive,
    sharedRemoteStream,
    setRemoteStream,
    remoteVideoRef,
    setIsRemoteStreamActive,
    setShowLocalScreenSharePrompt,
    setShowRemoteScreenSharePrompt,
    setShowScreenSharePrompt,
    setShowOpponentScreenShareRequiredModal,
    sharedPC,
    setPeerConnection,
    reportCheating,
  });

  const {
    code,
    setCode,
    executionResult,
    setExecutionResult,
    runStatus,
    setRunStatus,
    textareaRef,
    lineNumbersRef,
    highlightRef,
    editorHandlerRef,
    languageConfig,
    actualLineCount,
    displayLineCount,
    handleScroll,
    handleKeyDown,
    handleRun,
    handleSubmit,
    isSubmitModalOpen,
    handleConfirmSubmit,
    handleCancelSubmit,
  } = useBattleCodeEditor({
    problemId,
    isGamePaused,
    cleanupScreenShare,
    gameId, // gameId prop 전달
    isSolvingAlone, // isSolvingAlone prop 전달
    openCorrectAnswerModal, // openCorrectAnswerModal prop 전달
  });

  useBattleWebSocket({
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
    isSolvingAlone,
    openCorrectAnswerModal,
    setTimeLeft,
  });

  // usePreventNavigation hook
  const { confirmNavigation } = usePreventNavigation({
    shouldPrevent: true,
    onAttemptNavigation: (confirm, cancel) => {
      setIsExitModalOpen(true);
      setConfirmExitCallback(() => confirm);
      setCancelExitCallback(() => cancel);
    },
    onNavigationConfirmed: useCallback(() => {
      // 배틀 페이지 관련 로컬 스토리지 데이터 제거
      localStorage.removeItem("currentMatchId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("matchResult");
      localStorage.removeItem("websocketUrl");
      localStorage.removeItem("currentGameId");
      if (gameId) {
        localStorage.removeItem(`problem_${gameId}`);
      }
    }, [gameId]), // gameId를 종속성 배열에 추가
  });

  // Effect for localVideoRef and remoteVideoRef srcObject
  useEffect(() => {
    if (localVideoRef.current && sharedLocalStream) {
      localVideoRef.current.srcObject = sharedLocalStream;
    }
    if (remoteVideoRef.current && sharedRemoteStream) {
      remoteVideoRef.current.srcObject = sharedRemoteStream;
    }
  }, [sharedLocalStream, sharedRemoteStream]);

  return (
    <div ref={containerRef} className="min-h-screen">
      <header className="sticky top-0 z-50 cyber-card border-b border-cyber-blue/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold neon-text">Codeground</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`h-6 w-6 text-cyber-blue`} />
              <span className={`text-2xl font-bold font-mono text-cyber-blue ${isGamePaused && "text-gray-500"}`}>
                {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {isGamePaused || isGameFinished ? (
                <>
                  <CyberButton
                    onClick={handleReportClick}
                    size="sm"
                    variant="secondary"
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    신고
                  </CyberButton>
                  <CyberButton onClick={handleSurrenderLeave} size="sm">
                    <LogOut className="mr-1 h-4 w-4" />
                    나가기
                  </CyberButton>
                </>
              ) : (
                <>
                  <CyberButton
                    onClick={handleSurrenderButtonClick}
                    size="sm"
                    variant="secondary"
                  >
                    <Flag className="mr-1 h-4 w-4" />
                    항복
                  </CyberButton>
                  <CyberButton
                    onClick={handleReportClick}
                    size="sm"
                    variant="secondary"
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    신고
                  </CyberButton>
                  {!isLocalStreamActive &&
                    !isRemoteStreamActive && (
                      <CyberButton onClick={startLocalScreenShare} size="sm">
                        <Monitor className="mr-1 h-4 w-4" />
                        화면 공유 시작
                      </CyberButton>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-80px)] p-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex-grow mb-2 min-w-0">
                <BattleProblemPanel
                  problem={problem}
                />
              </div>
              <div className="h-1/3 min-h-[16em] flex gap-2 mr-2">
                <div className="flex-1 min-w-0">
                  <BattleChatPanel
                    chatMessages={chatMessages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    chatEndRef={chatEndRef}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <BattleRemoteVideoPanel
                    remoteVideoRef={remoteVideoRef}
                    sharedRemoteStream={sharedRemoteStream}
                    isRemoteStreamActive={isRemoteStreamActive}
                    showRemoteScreenSharePrompt={showRemoteScreenSharePrompt}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={40}>
            <BattleCodeEditorPanel
              code={code}
              setCode={setCode}
              executionResult={executionResult}
              runStatus={runStatus}
              textareaRef={textareaRef}
              lineNumbersRef={lineNumbersRef}
              highlightRef={highlightRef}
              languageConfig={languageConfig}
              displayLineCount={displayLineCount}
              handleScroll={handleScroll}
              handleKeyDown={handleKeyDown}
              isGamePaused={isGamePaused}
              handleRun={handleRun}
              handleSubmit={handleSubmit}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <GameExitModal
        isOpen={isExitModalOpen}
        onConfirmExit={handleConfirmExit}
        onCancelExit={handleCancelExit}
      />
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen} // useBattleCodeEditor에서 가져옴
        onConfirm={handleConfirmSubmit} // useBattleCodeEditor에서 가져옴
        onCancel={handleCancelSubmit} // useBattleCodeEditor에서 가져옴
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
      <OpponentLeftModal
        isOpen={showOpponentLeftModal}
        onStay={handleStay}
        onLeave={handleLeave}
      />
      <OpponentSurrenderModal
        isOpen={showSurrenderModal}
        onStay={handleSurrenderStay}
        onLeave={handleSurrenderLeave}
      />
      <ScreenShareRequiredModal
        isOpen={showScreenShareRequiredModal}
        countdown={screenShareCountdown}
        onRestartScreenShare={startLocalScreenShare}
      />
      <ScreenShareRequiredModal
        isOpen={showOpponentScreenShareRequiredModal}
        countdown={opponentScreenShareCountdown}
        isOpponent={true}
      />
      <CorrectAnswerModal
        isOpen={isCorrectAnswerModalOpen}
        isWinner={isWinner}
        onStay={handleCorrectAnswerStay}
        onLeave={handleCorrectAnswerLeave}
      />
    </div>
  );
};

export default BattlePage;
