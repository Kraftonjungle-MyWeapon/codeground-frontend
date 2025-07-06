import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Clock, Play, Send, Monitor, Flag, AlertTriangle, HelpCircle, LogOut } from 'lucide-react';
import { localStream as sharedLocalStream, remoteStream as sharedRemoteStream, setLocalStream, peerConnection as sharedPC, setPeerConnection, setRemoteStream } from '@/utils/webrtcStore';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProgrammingLanguage } from '@/types/codeEditor';
import { getLanguageConfig } from '@/utils/languageConfig';
import { CodeEditorHandler } from '@/utils/codeEditorHandlers';
import usePreventNavigation from '@/hooks/usePreventNavigation';
import GameExitModal from '@/components/GameExitModal';
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

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.replace(/^http/, 'ws');

hljs.registerLanguage('python', python);

const BattlePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  const { websocket, sendMessage, disconnect, connect } = useWebSocketStore();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(930);
  const [code, setCode] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { user: string; message: string; type: 'chat' | 'system' }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [executionResult, setExecutionResult] =
    useState("실행 결과가 여기에 표시됩니다.");
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isLocalStreamActive, setIsLocalStreamActive] = useState(true);
  const [showLocalScreenSharePrompt, setShowLocalScreenSharePrompt] = useState(false);
  const [showScreenSharePrompt, setShowScreenSharePrompt] = useState(false);
  const [isRemoteStreamActive, setIsRemoteStreamActive] = useState(true);
  const [showRemoteScreenSharePrompt, setShowRemoteScreenSharePrompt] = useState(false);
  const [isLeavingGame, setIsLeavingGame] = useState(false);
  const [showOpponentLeftModal, setShowOpponentLeftModal] = useState(false);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const [showScreenShareRequiredModal, setShowScreenShareRequiredModal] = useState(false);
  const [screenShareCountdown, setScreenShareCountdown] = useState(0);
  const screenShareCountdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false); // 게임 일시 정지 상태 추가
  const [isCheatDetectionActive, setIsCheatDetectionActive] = useState(true);
  const [isSolvingAlone, setIsSolvingAlone] = useState(false);
  const isConfirmedExitRef = useRef(false);
  const [problem, setProblem] = useState<any>(null);
  const problemId = problem?.id ?? problem?.problem_id;
  const [currentLanguage] = useState<ProgrammingLanguage>('python');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { reportCheating } = useCheatDetection({
    gameId,
    remoteVideoRef,
    containerRef,
    isActive: isCheatDetectionActive,
  });

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    setPeerConnection(pc);

    pc.oniceconnectionstatechange = () => {
      if (isGameFinished) return;
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        setShowScreenSharePrompt(true);
        setRemoteStream(null);
      }
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendMessage(
          JSON.stringify({ type: 'webrtc_signal', signal: { type: 'candidate', candidate } })
        );
      }
    };
    pc.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
      setIsRemoteStreamActive(true);
      setShowRemoteScreenSharePrompt(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      const remoteVideoTrack = stream.getVideoTracks()[0];
      if (remoteVideoTrack) {
        remoteVideoTrack.onended = () => {
          if (isGameFinished) return;
          setIsRemoteStreamActive(false);
          setShowRemoteScreenSharePrompt(true);
          sendMessage(JSON.stringify({ type: 'screen_share_stopped' }));
        };
      }
    };
    return pc;
  }, [sendMessage]);

  const handleSignal = useCallback(async (signal: any) => {
    let pc = sharedPC;
    if (!pc) {
      pc = createPeerConnection();
    }

    if (signal.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendMessage(JSON.stringify({ type: 'webrtc_signal', signal: pc.localDescription }));
    } else if (signal.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
    } else if (signal.type === 'candidate' && signal.candidate) {
      await pc.addIceCandidate(signal.candidate);
    }
    setPeerConnection(pc);
  }, [createPeerConnection, sendMessage]);

  useEffect(() => {
    if (!websocket) return;

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
            if (isRemoteStreamActive) {
              setIsGamePaused(false); // 두 사용자가 모두 공유 중일 때만 게임 재개
            }
          }
        }
      } catch (e) {
        console.error('BattlePage: ws message parse error', e);
      }
    };
  }, [websocket, user, handleSignal]);

  const cleanupScreenShare = useCallback(() => {
    const { websocket } = useWebSocketStore.getState(); // 최신 websocket 인스턴스를 직접 가져옴
    if (sharedLocalStream) {
      sharedLocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsLocalStreamActive(false);
      setShowLocalScreenSharePrompt(true);
      sendMessage(JSON.stringify({ type: 'screen_share_stopped' }));
    }
  }, [sendMessage]);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [confirmExitCallback, setConfirmExitCallback] = useState<(() => void) | null>(null);
  const [cancelExitCallback, setCancelExitCallback] = useState<(() => void) | null>(null);

  usePreventNavigation({
    shouldPrevent: true,
    onAttemptNavigation: (confirm, cancel) => {
      setIsExitModalOpen(true);
      setConfirmExitCallback(() => confirm);
      setCancelExitCallback(() => cancel);
    },
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const editorHandlerRef = useRef<CodeEditorHandler>(new CodeEditorHandler('python'));
  const languageConfig = getLanguageConfig(currentLanguage);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = hljs.highlight(code, { language: 'python' }).value + (code.endsWith('\n') ? '\n' : '');
      if (textareaRef.current) {
        highlightRef.current.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`;
      }
    }
  }, [code]);

  useEffect(() => {
    if (localVideoRef.current && sharedLocalStream) {
      localVideoRef.current.srcObject = sharedLocalStream;
    }
    if (remoteVideoRef.current && sharedRemoteStream) {
      remoteVideoRef.current.srcObject = sharedRemoteStream;
    }
  }, [sharedLocalStream, sharedRemoteStream]);

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
    const storedWebsocketUrl = localStorage.getItem('websocketUrl');
    let wsUrl: string | null = null;

    if (storedWebsocketUrl) {
      wsUrl = storedWebsocketUrl;
      console.log('BattlePage: Using stored WebSocket URL from localStorage:', wsUrl);
    } else if (user?.user_id && gameId) {
      wsUrl = `${wsUrl}/api/v1/game/ws/game/${gameId}?user_id=${user.user_id}`;
      console.log('BattlePage: Constructing WebSocket URL from gameId and userId:', wsUrl);
    } else {
      console.log('BattlePage: Cannot connect WebSocket. Missing gameId, userId, or stored URL.', { gameId, userId: user?.user_id });
      return;
    }

    if (!websocket || websocket.readyState === WebSocket.CLOSED) {
      console.log('BattlePage: WebSocket not connected or closed. Attempting to connect.');
      connect(wsUrl);
    }
  }, [websocket, user, gameId, connect]);

  useEffect(() => {
    if (isGamePaused || isGameFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendMessage(JSON.stringify({ type: "match_result", reason: "timeout" }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sendMessage, isGamePaused, isGameFinished]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msgObj = { type: "chat", message: newMessage };
    sendMessage(JSON.stringify(msgObj));
    setChatMessages((prev) => [...prev, { user: '나', message: newMessage, type: 'chat' }]);
    setNewMessage("");
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (payload: ReportPayload) => {
    reportCheating(payload);
    setIsReportModalOpen(false);
  };

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
  }, [confirmExitCallback]);

  const handleCancelExit = useCallback(() => {
    setIsExitModalOpen(false);
    if (cancelExitCallback) {
      cancelExitCallback();
    }
  }, [cancelExitCallback]);

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

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

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
      sendMessage(JSON.stringify({ type: 'webrtc_signal', signal: pc.localDescription }));
      sendMessage(JSON.stringify({ type: 'screen_share_started' })); // 화면 공유 재시작 메시지 전송

      stream.getVideoTracks()[0].onended = () => {
        cleanupScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
      setShowLocalScreenSharePrompt(true);
    }
  }, [createPeerConnection, sendMessage, cleanupScreenShare, isRemoteStreamActive]);

  const handleRun = async () => {
    setExecutionResult("코드를 실행하고 있습니다...");
    setRunStatus(null);

    try {
      const response = await authFetch(
        `${apiUrl}/api/v1/game/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            language: "python",
            code,
            problem_id: `${problemId}`,
          }),
        },
      );

      if (!response.ok || !response.body) {
        const text = await response.text();
        setExecutionResult(`실행 실패: ${text}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\r\n\r\n");
        buffer = parts.pop() || "";
        for (const chunk of parts) {
          const line = chunk.trim();
          if (line.startsWith("data:")) {
            const data = JSON.parse(line.slice(5));
            if (data.type === "progress") {
              setExecutionResult(
                (prev) =>
                  `${prev}\n[${data.index + 1}/${data.total}] stdout: ${data.result.stdout}`,
              );
            } else if (data.type === "final") {
              setExecutionResult(
                (prev) =>
                  `${prev}\n채점 완료. All Passed: ${data.allPassed ? "Yes" : "No"}`,
              );
              setRunStatus(data.allPassed ? "성공" : "실패");
            }
          }
        }
      }
    } catch (error) {
      setExecutionResult("실행 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = () => {
    cleanupScreenShare();
    navigate('/result');
  };

  const handleContinueAlone = () => {
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
    setIsLocalStreamActive(false);

    // 상대 화면 공유 중지
    if (sharedRemoteStream) {
      sharedRemoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsRemoteStreamActive(false);

    // 모든 화면 공유 관련 프롬프트 숨기기
    setShowLocalScreenSharePrompt(false);
    setShowRemoteScreenSharePrompt(false);
    setShowScreenSharePrompt(false);

    // WebRTC 연결 종료
    if (sharedPC) {
      sharedPC.close();
      setPeerConnection(null);
    }

    setIsSolvingAlone(true); // 혼자 풀기 모드 활성화
  }

  const handleStay = () => {
    setShowOpponentLeftModal(false);
    handleContinueAlone();
  };

  const handleSurrenderStay = () => {
    setShowSurrenderModal(false);
    handleContinueAlone();
  };

  const handleSurrenderLeave = () => {
    const stored = localStorage.getItem('matchResult');
    if (stored) {
      navigate('/result', { state: { matchResult: JSON.parse(stored) } });
    } else {
      navigate('/result');
    }
  };


  const handleLeave = () => {
    cleanupScreenShare();
    setShowOpponentLeftModal(false);
    navigate('/waiting-room');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (e.key === 'Tab') {
      e.preventDefault();
      editorHandlerRef.current.handleTabKey(textarea, e.shiftKey);
      setCode(textarea.value);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      editorHandlerRef.current.handleEnterKey(textarea);
      setCode(textarea.value);
    }
  };

  useEffect(() => {
    const gameId = searchParams.get('gameId');
    if (gameId) {
      const storedProblem = localStorage.getItem(`problem_${gameId}`);
      if (storedProblem) {
        try {
          const parsedProblem = JSON.parse(storedProblem);
          setProblem(parsedProblem);
        } catch (error) {
          console.error("Error parsing problem from localStorage:", error);
        }
      }
    }
  }, [searchParams]);

  const actualLineCount = code ? code.split("\n").length : 1;
  const displayLineCount = Math.max(actualLineCount, 20);

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
                            {/* {problemId && (
                                <span className="text-[9px] text-gray-400 mt-1">ID: {problemId}</span>
                            )} */}
                          </div>
                          <CyberButton onClick={toggleHint} size="sm" variant="secondary">
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
                          <p className="text-gray-300 leading-relaxed">{problem.description}</p>
                        </div>
                        {problem.examples && (
                          <div>
                            <h3 className="text-lg font-semibold text-cyber-blue mb-2">입출력 예</h3>
                            <div className="bg-black/30 p-3 rounded-lg border border-gray-700 space-y-2">
                              {problem.examples.map((example, index) => (
                                <div key={index} className="font-mono text-sm">
                                  <div className="text-gray-400">{example.input}</div>
                                  <div className="text-green-400">{example.output}</div>
                                </div>
                              ))}
                            </div>
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
                        {showRemoteScreenSharePrompt ? (
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