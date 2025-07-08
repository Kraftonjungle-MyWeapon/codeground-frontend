import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProblemWithImages } from '@/types/codeEditor';

interface UseBattleProblemProps {
  // No specific props needed from BattlePage for now, as it uses searchParams and local storage
}

export const useBattleProblem = (props?: UseBattleProblemProps) => {
  const [searchParams] = useSearchParams();
  const [problem, setProblem] = useState<ProblemWithImages | null>(null);
  const problemId = problem?.problem_id ?? problem?.problem_id;

  useEffect(() => {
    const gameId = searchParams.get('gameId') || localStorage.getItem('gameId');
    if (gameId) {
      const storedProblem = localStorage.getItem(`problem_${gameId}`);
      if (storedProblem) {
        try {
          const parsedProblem: ProblemWithImages = JSON.parse(storedProblem);
          console.log("BattlePage: Parsed problem:", parsedProblem);
          setProblem(parsedProblem);
        } catch (error) {
          console.error("Error parsing problem from localStorage:", error);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const gameId =
      searchParams.get('gameId') || localStorage.getItem('gameId');
    if (problem && gameId) {
      localStorage.setItem(`problem_${gameId}`, JSON.stringify(problem));
    }
  }, [problem, searchParams]);

  const imageUrlMap = useMemo(() => {
    if (!problem?.problemStatementImages) return new Map();
    return new Map(
      problem.problemStatementImages.map((image) => [image.name, image.url])
    );
  }, [problem]);

  const renderDescription = () => {
    if (!problem?.description) return null;

    const parts = problem.description.split(/(\n[IMAGE:.*?\n])/g);

    return parts.map((part, index) => {
      const imageMatch = part.match(/\n[IMAGE:(.*?)\n]/);
      if (imageMatch) {
        const imageName = imageMatch[1];
        const imageUrl = imageUrlMap.get(imageName);

        if (imageUrl) {
          return (
            <img
              key={index}
              src={imageUrl}
              alt={imageName}
              style={{ display: 'block', margin: '1rem auto', maxWidth: '80%' }}
            />
          );
        }
        return <span key={index} style={{ color: 'red' }}>[이미지 로드 실패: {imageName}]</span>;
      }
      
      return (
        <span key={index}>
          {part.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </span>
      );
    });
  };

  return {
    problem,
    problemId,
    renderDescription,
    setProblem,
  };
};