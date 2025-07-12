import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // problem_{gameId} 제거 (동적 키)를 위해 gameId를 먼저 가져옴
    const gameId = sessionStorage.getItem("gameId");

    // 배틀 페이지 관련 세션 스토리지 데이터 제거
    sessionStorage.removeItem("currentMatchId");
    sessionStorage.removeItem("gameId");
    sessionStorage.removeItem("matchResult");
    sessionStorage.removeItem("websocketUrl");
    sessionStorage.removeItem("currentGameId");

    if (gameId) {
      sessionStorage.removeItem(`problem_${gameId}`);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CyberCard glowing className="p-8 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-cyber-red mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-gray-400 mb-8">
          요청하신 경로는 존재하지 않거나, 현재 사용할 수 없습니다.
        </p>
        <Link to="/">
          <CyberButton className="w-full text-lg py-3">
            <Home className="h-5 w-5 mr-2" />
            홈으로 돌아가기
          </CyberButton>
        </Link>
      </CyberCard>
    </div>
  );
};

export default NotFound;
