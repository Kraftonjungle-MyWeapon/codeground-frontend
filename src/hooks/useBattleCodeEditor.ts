import { useState, useRef, useEffect, useCallback } from 'react';
import { authFetch } from '@/utils/api';
import { getLanguageConfig } from '@/utils/languageConfig';
import { CodeEditorHandler } from '@/utils/codeEditorHandlers';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams 임포트

hljs.registerLanguage('python', python);

const apiUrl = import.meta.env.VITE_API_URL;

interface UseBattleCodeEditorProps {
  problemId: string | number | undefined;
  isGamePaused: boolean;
  cleanupScreenShare: () => void;
  gameId: string | null; // gameId prop 추가
  isSolvingAlone: boolean; // isSolvingAlone prop 추가
  openCorrectAnswerModal: (isWinner: boolean) => void; // openCorrectAnswerModal prop 추가
  setIsGameFinished: (isFinished: boolean) => void; // setIsGameFinished prop 추가
}

export const useBattleCodeEditor = ({
  problemId,
  isGamePaused,
  cleanupScreenShare,
  isSolvingAlone, // isSolvingAlone prop 받기
  openCorrectAnswerModal, // openCorrectAnswerModal prop 받기
  setIsGameFinished, // setIsGameFinished prop 받기
}: UseBattleCodeEditorProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // useSearchParams 훅 사용
  const matchType = searchParams.get('matchType'); // matchType 가져오기

  // gameId를 sessionStorage에서 가져오도록 변경
  const gameId = sessionStorage.getItem("gameId");

  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] = useState("실행 결과가 여기에 표시됩니다.");
  const [runStatus, setRunStatus] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const editorHandlerRef = useRef<CodeEditorHandler>(new CodeEditorHandler('python'));
  const [currentLanguage] = useState<"python">('python'); // 현재는 python 고정, 추후 변경 가능
  const languageConfig = getLanguageConfig(currentLanguage);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const getResultMessage = (
    status?: string,
    allPassed?: boolean,
  ): string => {
    if (allPassed) return '성공';

    switch (status) {
      case 'success':
        return '성공';
      case 'compile_error':
      case 'syntax_error':
        return '실패 - 컴파일 오류';
      case 'runtime_exception':
        return '실패 - 런타임 예외';
      case 'timeout':
        return '실패 - 시간 초과';
      case 'wrong_output':
        return '실패 - 출력 결과 상이';
      default:
        console.log('status', status);
        return '실패';
    }
  };

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = hljs.highlight(code, { language: 'python' }).value + (code.endsWith('\n') ? '\n' : '');
      if (textareaRef.current) {
        textareaRef.current.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`;
      }
    }
  }, [code]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  }, []);

  const handleRun = useCallback(async () => {
    setExecutionResult("코드를 실행하고 있습니다...");
    setRunStatus(null);

    try {
      const response = await authFetch(
        `${apiUrl}/api/v1/game/submit_public`,
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
            match_id: gameId, // sessionStorage 대신 gameId prop 사용
            is_public: matchType !== 'custom',
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
                  `${prev}\n[${data.index + 1}/${data.total}] duration: ${Number(data.result.duration).toFixed(2)} ms, memoryUsed: ${data.result.memoryUsed} KB, status: ${data.result.status}`,
                );
            } else if (data.type === "final") {
              const message = getResultMessage(data.status, data.allPassed);
              setExecutionResult((prev) => `${prev}\n채점 완료: ${message}`);
              setRunStatus(message);
            }
          }
        }
      }
    } catch (error) {
      setExecutionResult("실행 중 오류가 발생했습니다.");
    }
  }, [code, problemId]);

  const submitFinal = useCallback(async () => {
    setExecutionResult('코드를 제출하고 있습니다...');
    try {
      const response = await authFetch(
        `${apiUrl}/api/v1/game/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            language: 'python',
            code,
            problem_id: `${problemId}`,
            match_id: gameId,
            is_public: matchType !== 'custom',
          }),
        },
      );

      if (!response.ok || !response.body) {
        const text = await response.text();
        setExecutionResult(`제출 실패: ${text}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\r\n\r\n');
        buffer = parts.pop() || '';
        for (const chunk of parts) {
          const line = chunk.trim();
          if (line.startsWith('data:')) {
            const data = JSON.parse(line.slice(5));
            if (data.type === 'progress') {
              setExecutionResult(
                (prev) =>
                  `${prev}\n[${data.index + 1}/${data.total}] duration: ${Number(
                    data.result.duration,
                  ).toFixed(2)} ms, memoryUsed: ${data.result.memoryUsed} KB, status: ${data.result.status}`,
              );
            } else if (data.type === 'final') {
              const message = getResultMessage(data.result?.status, data.allPassed);
              setExecutionResult((prev) => `${prev}\n채점 완료: ${message}`);
              // 성공 시 페이지 이동 로직은 웹소켓 match_result 핸들러가 담당하므로 여기서는 제거합니다.
            }
          }
        }
      }
    } catch (error) {
      setExecutionResult('제출 중 오류가 발생했습니다.');
    }
  }, [code, problemId, cleanupScreenShare, navigate, isSolvingAlone, openCorrectAnswerModal]);


  const handleSubmit = useCallback(() => {
    // 제출 버튼을 누르면 항상 확인 모달을 띄웁니다.
  //   setIsSubmitModalOpen(true);
  // }, []);
    if (runStatus === "성공") {
      // 테스트케이스들을 모두 통과한 경우 바로 제출합니다.
      submitFinal();
    } else {
      // 통과하지 못한 경우 확인 모달을 표시합니다.
      setIsSubmitModalOpen(true);
    }
  }, [runStatus, submitFinal]);

  const handleConfirmSubmit = useCallback(() => {
    // 모달에서 확인을 누르면 제출 로직을 실행합니다.
    setIsSubmitModalOpen(false);
    submitFinal();
  }, [submitFinal]);

  const handleCancelSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
  }, []);

  const actualLineCount = code ? code.split("\n").length : 1;
  const displayLineCount = Math.max(actualLineCount, 20);

  return {
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
  };
};