import { useState } from "react";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle } from "lucide-react";
import { ProblemWithImages } from "@/types/codeEditor";

type BattleProblemPanelProps = {
  problem: ProblemWithImages | null;
};

const BattleProblemPanel = ({
  problem,
}: BattleProblemPanelProps) => {
  const [showHint, setShowHint] = useState(false);

  const renderProblemDescription = () => {
    if (!problem || !problem.description) return null;

  //   const parts = problem.description.split(/(\[IMAGE:[^\]]+\])/g);

  //   return parts.map((part, index) => {
  //     if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
  //       const imageId = part.substring(7, part.length - 1);
  //       const image = problem.problemStatementImages?.find(img => img.name.includes(imageId));
  //       if (image) {
  //         return <img key={index} src={image.url} alt={image.name} className="my-2 max-w-full h-auto rounded-lg object-contain mx-auto block" />;
  //       }
  //     }
  //     return <span key={index}>{part}</span>;
  //   });
  // };

    // 1차: 이미지 토큰 기준 분리 (캡처 그룹 유지)
    const parts = problem.description.split(/(\[IMAGE:[^\]]+\])/g);
    let key = 0;

    return parts.flatMap((part) => {
      if (!part) return []; // skip empty

      // 이미지 토큰?
      if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
        const imageId = part.slice(7, -1); // "[IMAGE:" == 7 chars
        const image = problem.problemStatementImages?.find((img) =>
          img.name.includes(imageId)
        );
        if (!image) return []; // 이미지 못 찾으면 무시(또는 대체 텍스트)
        return (
          <img
            key={`img-${key++}`}
            src={image.url}
            alt={image.name ?? imageId}
            className="my-2 max-w-full h-auto rounded-lg object-contain mx-auto block"
          />
        );
      }

      // 텍스트 조각: 줄바꿈 기준으로 다시 분리
      const lines = part.split(/\r?\n/g);
      const nodes: React.ReactNode[] = [];

      lines.forEach((line, i) => {
        // 줄 내용
        nodes.push(
          <span
            key={`txt-${key++}`}
            className="whitespace-pre-wrap" // 텍스트 내 연속 공백도 보존하려면
          >
            {line}
          </span>
        );
        // 줄바꿈 삽입 (마지막 줄 제외)
        if (i < lines.length - 1) {
          nodes.push(<br key={`br-${key++}`} />);
        }
      });

      return nodes;
    });
  };



  return (
    <CyberCard className="h-[calc(100vh-24em)] p-4 mr-2 max-h-[860px]">
      <ScrollArea className="h-full">
        {problem ? (
          <div className="space-y-4 pr-4 w-full">
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
            <div className="w-full">
              {/* <p className="text-gray-300 leading-relaxed max-w-full overflow-hidden">
                {renderProblemDescription()}
              </p> */}
              <div className="text-gray-300 leading-relaxed max-w-full overflow-hidden">
                {renderProblemDescription()}
              </div>
            </div>

            {/* 입력 형식 */}
            {problem.input_format && (
              <div>
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  입력 형식
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                  {problem.input_format}
                </p>
              </div>
            )}

            {/* 출력 형식 */}
            {problem.output_format && (
              <div>
                <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                  출력 형식
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                  {problem.output_format}
                </p>
              </div>
            )}

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
                  {problem.constraints && (
                    <li>
                      • 제한 사항:{" "}
                      {problem.constraints}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* 입출력 예 (Public Test Cases) */}
            {problem.test_cases &&
              problem.test_cases.filter((tc) => tc.visibility === "public")
                .length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-cyber-blue mb-2">
                    입출력 예
                  </h3>
                  {problem.test_cases
                    .filter((tc) => tc.visibility === "public")
                    .map((testCase, index) => (
                      <div key={index} className="mb-4 p-3 bg-black/20 rounded-lg border border-gray-700">
                        <h4 className="text-yellow-400 font-medium mb-2">
                          예제 {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-gray-300">입력 예</p>
                            <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap break-words">
                              {testCase.input}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-300">출력 예</p>
                            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-words">
                              {testCase.output}
                            </pre>
                          </div>
                        </div>
                        {testCase.description && (
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <h5 className="text-yellow-400 font-semibold mb-1">힌트:</h5>
                            <p className="text-yellow-300 text-sm whitespace-pre-wrap break-words">
                              {testCase.description}
                            </p>
                          </div>
                        )}
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
