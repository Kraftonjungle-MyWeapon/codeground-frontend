import { useState } from "react";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle } from "lucide-react";
import { ProblemWithImages } from "@/types/codeEditor";

type BattleProblemPanelProps = {
  problem: ProblemWithImages | null;
  renderDescription: () => React.ReactNode;
};

const BattleProblemPanel = ({
  problem,
  renderDescription,
}: BattleProblemPanelProps) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <CyberCard className="h-[calc(100vh-24em)] p-4 mr-2 max-h-[860px]">
      <ScrollArea className="h-full">
        {problem ? (
          <div className="space-y-4 pr-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold neon-text">{problem.title}</h1>
              </div>
              <CyberButton
                onClick={() => setShowHint(!showHint)}
                size="sm"
                variant="secondary"
              >
                <HelpCircle className="mr-1 h-4 w-4" />
                힌트
              </CyberButton>
            </div>
            {showHint && problem.category && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  알고리즘 분류
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.category.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-gray-300 leading-relaxed">
                {renderDescription()}
              </p>
            </div>
            {(problem.time_limit_milliseconds ||
              problem.memory_limit_kilobytes) && (
              <div>
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  제한 사항
                </h3>
                <ul className="text-gray-300 space-y-1">
                  {problem.time_limit_milliseconds && (
                    <li>
                      • 시간 제한:{" "}
                      {parseInt(problem.time_limit_milliseconds) / 1000} 초
                    </li>
                  )}
                  {problem.memory_limit_kilobytes && (
                    <li>
                      • 메모리 제한:{" "}
                      {parseInt(problem.memory_limit_kilobytes) / 1024} MB
                    </li>
                  )}
                </ul>
              </div>
            )}

            {problem.sample_input && problem.sample_output && (
              <div>
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  입출력 예
                </h3>
                <div className="flex space-x-4">
                  <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                    <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-words">
                      {problem.sample_input}
                    </pre>
                  </div>
                  <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                    <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">
                      {problem.sample_output}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {problem.test_cases &&
              problem.test_cases.filter((tc) => tc.visibility === "public")
                .length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                    입출력 예 설명
                  </h3>
                  {problem.test_cases
                    .filter((tc) => tc.visibility === "public")
                    .map((testCase, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="text-yellow-400 font-medium mb-2">
                          입출력 예 #{index + 1}
                        </h4>
                        <div className="flex space-x-4">
                          <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                            <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-words">
                              {testCase.input}
                            </pre>
                          </div>
                          <div className="w-1/2 flex-shrink-0 bg-black/30 p-3 rounded-lg border border-gray-700">
                            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">
                              {testCase.output}
                            </pre>
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
  );
};

export default BattleProblemPanel;
