import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProblemWithImages } from '@/types/codeEditor';
import { fetchProblemForGame } from '@/utils/api'; // fetchProblemForGame 임포트

interface UseBattleProblemProps {
  // No specific props needed from BattlePage for now, as it uses searchParams and local storage
}

export const useBattleProblem = (props?: UseBattleProblemProps) => {
  const [searchParams] = useSearchParams();
  const [problem, setProblem] = useState<ProblemWithImages | null>(null);
  const problemId = problem?.problem_id ?? problem?.problem_id;

  useEffect(() => {
    const gameId = searchParams.get('gameId') || sessionStorage.getItem('gameId');
    if (gameId) {
      const storedProblem = sessionStorage.getItem(`problem_${gameId}`);
      if (storedProblem) {
        try {
          const parsedProblem: ProblemWithImages = JSON.parse(storedProblem);
          console.log("BattlePage: Parsed problem from sessionStorage:", parsedProblem);
          setProblem(parsedProblem);
        } catch (error) {
          console.error("Error parsing problem from localStorage:", error);
        }
      } else { // sessionStorage에 문제가 없을 경우 fetchProblemForGame 호출
        const loadProblem = async () => {
          try {
            // problem_url과 image_urls는 fetchProblemForGame 내부에서 처리되므로 빈 객체 전달
            await fetchProblemForGame({ problem_url: '', image_urls: [] }, Number(gameId));
            const fetchedProblem = sessionStorage.getItem(`problem_${gameId}`);
            if (fetchedProblem) {
              setProblem(JSON.parse(fetchedProblem));
            }
          } catch (error) {
            console.error("Error fetching problem with fetchProblemForGame:", error);
          }
        };
        loadProblem();
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const gameId =
      searchParams.get('gameId') || sessionStorage.getItem('gameId');
    if (problem && gameId) {
      sessionStorage.setItem(`problem_${gameId}`, JSON.stringify(problem));
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