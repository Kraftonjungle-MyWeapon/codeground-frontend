import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Clock, Play, Send, Monitor, Flag, AlertTriangle, HelpCircle, LogOut } from 'lucide-react';
import { localStream as sharedLocalStream, remoteStream as sharedRemoteStream, setLocalStream, peerConnection as sharedPC, setPeerConnection, setRemoteStream } from '@/utils/webrtcStore';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProblemWithImages, ProgrammingLanguage } from '@/types/codeEditor';
import { getLanguageConfig } from '@/utils/languageConfig';
import { CodeEditorHandler } from '@/utils/codeEditorHandlers';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import GameExitModal from '@/components/GameExitModal';
import SubmitConfirmModal from '@/components/SubmitConfirmModal';
import useWebSocketStore from '@/stores/websocketStore';
import { authFetch } from '@/utils/api';
import useCheatDetection, { ReportPayload } from '@/hooks/useCheatDetection';
import ReportModal from '@/components/ReportModal';
import { OpponentLeftModal } from '@/components/OpponentLeftModal';
import { OpponentSurrenderModal } from '@/components/OpponentSurrenderModal';
import { ScreenShareRequiredModal } from '@/components/ScreenShareRequiredModal';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/vs2015.css';

// Custom Hooks
import { useBattleWebRTC } from '@/hooks/useBattleWebRTC';
import { useBattleWebSocket } from '@/hooks/useBattleWebSocket';
import { useBattleScreenShare } from '@/hooks/useBattleScreenShare';
import { useBattleTimer } from '@/hooks/useBattleTimer';
import { useBattleChat } from '@/hooks/useBattleChat';
import { useBattleCodeEditor } from '@/hooks/useBattleCodeEditor';
import { useBattleProblem } from '@/hooks/useBattleProblem.tsx';
import { useBattleModals } from '@/hooks/useBattleModals';

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.replace(/^http/, 'ws');

hljs.registerLanguage('python', python);

const BattlePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const { websocket, sendMessage, disconnect, connect } = useWebSocketStore();
  
  // Refs that remain in BattlePage
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States that remain in BattlePage
  const [showHint, setShowHint] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isCheatDetectionActive, setIsCheatDetectionActive] = useState(true);
  const [currentLanguage] = useState<ProgrammingLanguage>('python');
  const [showScreenSharePrompt, setShowScreenSharePrompt] = useState(false);

  // Custom Hook Calls
  const { reportCheating } = useCheatDetection({
    gameId,
    remoteVideoRef,
    containerRef,
    isActive: isCheatDetectionActive,
  });

  const { isRemoteStreamActive, setIsRemoteStreamActive, setShowRemoteScreenSharePrompt, createPeerConnection, handleSignal } = useBattleWebRTC({
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
    screenShareCountdownIntervalRef
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

  const { timeLeft } = useBattleTimer({
    isGamePaused,
    isGameFinished,
  });

  const { chatMessages, newMessage, setNewMessage, handleSendMessage, chatEndRef, setChatMessages } = useBattleChat();

  const { problem, problemId, renderDescription, setProblem } = useBattleProblem();

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
    handleCancelSubmit
  } = useBattleCodeEditor({
    problemId,
    isGamePaused,
    cleanupScreenShare,
  });

  const {
    isExitModalOpen, setIsExitModalOpen,
    isSubmitModalOpen: isSubmitModalOpenFromModals, setIsSubmitModalOpen: setIsSubmitModalOpenFromModals,
    confirmExitCallback, setConfirmExitCallback,
    cancelExitCallback, setCancelExitCallback,
    isReportModalOpen, setIsReportModalOpen,
    showOpponentLeftModal, setShowOpponentLeftModal,
    showSurrenderModal, setShowSurrenderModal,
    isSolvingAlone, isConfirmedExitRef,
    handleReportClick, handleReportSubmit,
    handleSurrenderButtonClick, handleConfirmExit, handleCancelExit,
    handleConfirmSubmit: handleConfirmSubmitModal, handleCancelSubmit: handleCancelSubmitModal,
    handleContinueAlone, handleStay, handleSurrenderStay, handleSurrenderLeave, handleLeave
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
    sharedPC,
    setPeerConnection,
    reportCheating,
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
  });

  // usePreventNavigation hook
  usePreventNavigation({
    shouldPrevent: true,
    onAttemptNavigation: (confirm, cancel) => {
      setIsExitModalOpen(true);
      setConfirmExitCallback(() => confirm);
      setCancelExitCallback(() => cancel);
    },
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
    <div ref={containerRef} className="min-h-screen cyber-grid bg-cyber-darker">
      <header className="sticky top-0 z-50 cyber-card border-b border-cyber-blue/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold neon-text">Codeground</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`h-6 w-6 text-cyber-blue`} />
              <span className={`text-2xl font-bold font-mono text-cyber-blue`}>
                {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {!isSolvingAlone && (
                <CyberButton onClick={handleSurrenderButtonClick} size="sm" variant="secondary">
                  <Flag className="mr-1 h-4 w-4" />
                  항복
                </CyberButton>
              )}
              <CyberButton onClick={handleReportClick} size="sm" variant="secondary">
                <AlertTriangle className="mr-1 h-4 w-4" />
                신고
              </CyberButton>
              {isSolvingAlone ? (
                <CyberButton onClick={handleSurrenderLeave} size="sm">
                  <LogOut className="mr-1 h-4 w-4" />
                  나가기
                </CyberButton>
              ) : (
                (!isLocalStreamActive && !isRemoteStreamActive) && (
                  <CyberButton onClick={startLocalScreenShare} size="sm">
                    <Monitor className="mr-1 h-4 w-4" />
                    화면 공유 시작
                  </CyberButton>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-80px)] p-4">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex-1 mb-2">
                <CyberCard className="h-[calc(100vh-24em)] p-4 mr-2 max-h-[860px]">
                  <ScrollArea className="h-full">
                    {problem ? (
                      <div className="space-y-4 pr-4">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <h1 className="text-xl font-bold neon-text">{problem.title}</h1>
                          </div>
                          <CyberButton onClick={() => setShowHint(!showHint)} size="sm" variant="secondary">
                            <HelpCircle className="mr-1 h-4 w-4" />
                            힌트
                          </CyberButton>
                        </div>
                        {showHint && problem.category && (
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <h3 className="text-yellow-400 font-semibold mb-2">알고리즘 분류</h3>
                            <div className="flex flex-wrap gap-2">
                              {problem.category.map((tag, index) => (
                                <span key={index} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-300 leading-relaxed">{renderDescription()}</p>
                        </div>
                        {(problem.time_limit_milliseconds || problem.memory_limit_kilobytes) && (
                          <div>
                            <h3 className="text-lg font-semibold text-cyber-blue mb-2">제한 사항</h3>
                            <ul className="text-gray-300 space-y-1">
                              {problem.time_limit_milliseconds && (
                                <li>• 시간 제한: {parseInt(problem.time_limit_milliseconds) / 1000} 초</li>
                              )}
                              {problem.memory_limit_kilobytes && (
                                <li>• 메모리 제한: {parseInt(problem.memory_limit_kilobytes) / 1024} MB</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {problem.sample_input && problem.sample_output && (
                          <div>
                            <h3 className="text-lg font-semibold text-cyber-blue mb-2">입출력 예</h3>
                            <div className="flex space-x-4">
                              <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                                <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-words">{problem.sample_input}</pre>
                              </div>
                              <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">{problem.sample_output}</pre>
                              </div>
                            </div>
                          </div>
                        )}

                        {problem.test_cases && problem.test_cases.filter(tc => tc.visibility === 'public').length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-cyber-blue mb-2">입출력 예 설명</h3>
                            {problem.test_cases.filter(tc => tc.visibility === 'public').map((testCase, index) => (
                              <div key={index} className="mb-4">
                                <h4 className="text-yellow-400 font-medium mb-2">입출력 예 #{index + 1}</h4>
                                <div className="flex space-x-4">
                                  <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                                    <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-words">{testCase.input}</pre>
                                  </div>
                                  <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                                    <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">{testCase.output}</pre>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">문제 로딩 중...</div>
                    )}
                  </ScrollArea>
                </CyberCard>
              </div>
              <div className="h-1/3 min-h-[16em] flex gap-2 mr-2">
                <div className="flex-1 min-w-0">
                  <CyberCard className="p-3 flex flex-col h-full">
                    <h3 className="text-sm font-semibold text-cyber-blue mb-2">채팅</h3>
                    <ScrollArea className="flex-1 mb-2">
                      <div className="space-y-2 pr-3">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`text-xs ${msg.type === 'system' ? 'text-red-400' : 'text-gray-400'}`}>
                            <div>
                              {msg.user}: {msg.message}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    </ScrollArea>
                    <div className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="메시지 입력..."
                        className="flex-1 text-xs bg-black/30 border border-gray-600 rounded-l px-2 py-1 text-white"
                      />
                      <button onClick={handleSendMessage} className="bg-cyber-blue px-2 py-1 rounded-r">
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  </CyberCard>
                </div>
                <div className="flex-1 min-w-0">
                  <CyberCard className="p-3 flex flex-col items-center justify-center h-full">
                    {sharedRemoteStream && isRemoteStreamActive ? (
                      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-xs text-gray-400 text-center">
                        <Monitor className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                        <div>상대방 화면</div>
                        {setShowRemoteScreenSharePrompt ? (
                          <div className="mt-1 text-red-400">공유 중지됨. 상대방이 다시 공유해야 합니다.</div>
                        ) : (
                          <div className="mt-1 text-yellow-400">공유 대기중...</div>
                        )}
                      </div>
                    )}
                  </CyberCard>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75} minSize={50}>
                <CyberCard className="h-full flex flex-col ml-2 mb-1">
                  <div className="flex items-center px-3 py-1 border-b border-gray-700/50 bg-black/20">
                    <div className="text-xs text-gray-400">{languageConfig.name} Code Editor</div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full flex bg-black/30">
                      <div ref={lineNumbersRef} className="flex-shrink-0 w-12 bg-black/20 border-r border-gray-700 overflow-hidden">
                        <div className="text-xs text-gray-500 leading-5 text-right py-3 px-2">
                          {Array.from({ length: displayLineCount }, (_, i) => (
                            <div key={i} className="h-5">{i + 1}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden relative">
                        <pre ref={highlightRef} className="hljs pointer-events-none w-full h-full px-3 py-3 text-sm leading-5 font-mono whitespace-pre-wrap" style={{ fontFamily: languageConfig.fontFamily }} />
                        <textarea
                          ref={textareaRef}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          onScroll={handleScroll}
                          onKeyDown={handleKeyDown}
                          placeholder={languageConfig.placeholder}
                          spellCheck={false}
                          className="w-full h-full absolute top-0 left-0 bg-transparent px-3 py-3 font-mono resize-none focus:outline-none text-sm leading-5 border-none"
                          style={{ fontFamily: languageConfig.fontFamily, tabSize: languageConfig.indentSize, color: 'transparent', caretColor: '#ffffff' }}
                          readOnly={isGamePaused}
                        />
                      </div>
                    </div>
                  </div>
                </CyberCard>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15}>
                <CyberCard className="h-full flex flex-col ml-2 mt-1">
                  <div className="flex items-center justify-between px-3 py-1 border-b border-gray-700/50">
                    <h3 className="text-sm font-semibold text-cyber-blue">실행 결과</h3>
                    <div className="flex space-x-1">
                      <CyberButton onClick={handleRun} size="sm" variant="secondary" className="px-6" disabled={isGamePaused}>
                        <Play className="mr-1 h-3 w-3" />
                        실행
                      </CyberButton>
                      <CyberButton onClick={handleSubmit} size="sm" className="px-6" disabled={isGamePaused}>
                        제출
                      </CyberButton>
                    </div>
                  </div>
                  <div className="flex-1 p-2">
                    <div className="h-full bg-black/30 border border-gray-700 rounded p-3 overflow-auto">
                      <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap break-words">
                        {executionResult}
                      </pre>
                    </div>
                  </div>
                </CyberCard>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <GameExitModal
        isOpen={isExitModalOpen}
        onConfirmExit={handleConfirmExit}
        onCancelExit={handleCancelExit}
      />
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onConfirm={handleConfirmSubmitModal}
        onCancel={handleCancelSubmitModal}
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
    </div>
  );
};

export default BattlePage;
