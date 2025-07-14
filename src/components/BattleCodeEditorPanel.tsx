import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Play } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { LanguageConfig } from "@/utils/languageConfig";
import React from "react";

interface BattleCodeEditorPanelProps {
  code: string;
  setCode: (value: string) => void;
  executionResult: string;
  runStatus: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  lineNumbersRef: React.RefObject<HTMLDivElement>;
  highlightRef: React.RefObject<HTMLPreElement>;
  languageConfig: LanguageConfig;
  displayLineCount: number;
  handleScroll: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isGamePaused: boolean;
  handleRun: () => void;
  handleSubmit: () => void;
}

const BattleCodeEditorPanel = ({
  code,
  setCode,
  executionResult,
  runStatus,
  textareaRef,
  lineNumbersRef,
  highlightRef,
  languageConfig,
  displayLineCount,
  handleScroll,
  handleKeyDown,
  isGamePaused,
  handleRun,
  handleSubmit,
}: BattleCodeEditorPanelProps) => {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={75} minSize={50}>
        <CyberCard className="h-full flex flex-col ml-2 mb-1">
          <div className="flex items-center px-3 py-1 border-b border-gray-700/50 bg-black/20">
            <div className="text-xs text-gray-400">
              {languageConfig.name} Code Editor
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex bg-black/30">
              <div
                ref={lineNumbersRef}
                className="flex-shrink-0 w-12 bg-black/20 border-r border-gray-700 overflow-hidden"
              >
                <div className="text-xs text-gray-500 leading-5 text-right py-3 px-2">
                  {Array.from({ length: displayLineCount }, (_, i) => (
                    <div key={i} className="h-5">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <pre
                  ref={highlightRef}
                  className="hljs pointer-events-none w-full h-full px-3 py-3 text-sm leading-5 font-mono whitespace-pre-wrap"
                  style={{ fontFamily: languageConfig.fontFamily }}
                />
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  placeholder={languageConfig.placeholder}
                  spellCheck={false}
                  className="w-full h-full absolute top-0 left-0 bg-transparent px-3 py-3 font-mono resize-none focus:outline-none text-sm leading-5 border-none"
                  style={{
                    fontFamily: languageConfig.fontFamily,
                    tabSize: languageConfig.indentSize,
                    color: "transparent",
                    caretColor: "#ffffff",
                  }}
                  readOnly={isGamePaused}
                />
              </div>
            </div>
          </div>
        </CyberCard>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={15}>
        <CyberCard className="h-full flex flex-col ml-2 mt-1 mb-[1px] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1 border-b border-gray-700/50">
            <h3 className="text-sm font-semibold text-cyber-blue">
              실행 결과
              {runStatus && (
              <span
                className={
                runStatus === "성공"
                  ? "ml-2 text-green-400"
                  : "ml-2 text-red-400"
                }
              >
                {runStatus}
              </span>
              )}
            </h3>
            <div className="flex space-x-1">
              <CyberButton
                onClick={handleRun}
                size="sm"
                variant="secondary"
                className="px-6"
                disabled={isGamePaused}
              >
                <Play className="mr-1 h-3 w-3" />
                실행
              </CyberButton>
              <CyberButton
                onClick={handleSubmit}
                size="sm"
                className="px-6"
                disabled={isGamePaused}
              >
                제출
              </CyberButton>
            </div>
          </div>
          <div className="h-full flex-1 p-2"  style={{  overflowY: "auto" }}>
            <div className="h-full bg-black/30 border border-gray-700 rounded p-3 overflow-auto">
              <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap break-words">
                {executionResult}
              </pre>
            </div>
          </div>
        </CyberCard>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default BattleCodeEditorPanel;
