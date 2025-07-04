import { useState, useEffect } from "react";
import { getCookie } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import CreateRoomModal from "@/components/CreateRoomModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Swords, Trophy, Users, Zap, Star, Crown, Play } from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@/context/UserContext"; // useUser 훅 import



import { getRankings } from "@/utils/api";

const Index = () => {
  const navigate = useNavigate();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [topRanking, setTopRanking] = useState<any[]>([]);

  const { user, isLoading, isError } = useUser(); // useUser 훅 사용

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getRankings("python3"); // 기본 언어 python3로 랭킹 가져오기
        setTopRanking(data.rankings.slice(0, 5)); // 백엔드 응답이 { language: string, rankings: RankingEntry[] } 형태
      } catch (error) {
        console.error(error);
      }
    };

    fetchRankings();
  }, []);

  // useUser 훅에서 가져온 user 객체를 직접 사용
  const currentUser = user ? {
    id: user.user_id,
    name: user.nickname || user.username || 'CyberCoder',
    totalScore: user.totalScore || 1580,
    wins: 87, // 백엔드에서 제공되지 않음
    losses: 40, // 백엔드에서 제공되지 않음
    totalBattles: 127, // 백엔드에서 제공되지 않음
    rank: 15, // 백엔드에서 제공되지 않음
  } : {
    id: 0,
    name: 'CyberCoder',
    totalScore: 1580,
    wins: 87,
    losses: 40,
    totalBattles: 127,
    rank: 15,
  };

  const { tier, lp } = parseTotalScore(currentUser.totalScore);
  const winRate = ((currentUser.wins / currentUser.totalBattles) * 100).toFixed(1);

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (isError || !user) {
    return <div>Error loading user data or user not logged in. Displaying dummy data.</div>;
  }

  // 대기방 목록 데이터 (더 많은 더미 데이터)
  const waitingRooms = [
    {
      id: 1,
      title: "알고리즘 스피드런",
      description: "Python / 정렬 / 초급",
      players: "1/2",
      language: "Python",
      difficulty: "초급",
      hostName: "SpeedCoder",
      hostTier: "Silver III",
    },
    {
      id: 2,
      title: "Node.js 백엔드 구현",
      description: "JavaScript / 백엔드 / 고급",
      players: "0/2",
      language: "JavaScript",
      difficulty: "고급",
      hostName: "BackendNinja",
      hostTier: "Diamond V",
    },
    {
      id: 3,
      title: "Rust 메모리 관리",
      description: "Rust / 시스템 / 전문가",
      players: "1/2",
      language: "Rust",
      difficulty: "전문가",
      hostName: "RustGuru",
      hostTier: "Diamond II",
    },
    {
      id: 4,
      title: "Python 알고리즘 챌린지",
      description: "Python / 자료구조 / 중급",
      players: "1/2",
      language: "Python",
      difficulty: "중급",
      hostName: "AlgoMaster",
      hostTier: "Diamond III",
    },
    {
      id: 5,
      title: "JavaScript 스피드 코딩",
      description: "JavaScript / 구현 / 초급",
      players: "1/2",
      language: "JavaScript",
      difficulty: "초급",
      hostName: "CodeNinja",
      hostTier: "Gold I",
    },
    {
      id: 6,
      title: "Java 고급 문제 해결",
      description: "Java / 동적계획법 / 고급",
      players: "2/2",
      language: "Java",
      difficulty: "고급",
      hostName: "ByteWarrior",
      hostTier: "Platinum II",
    },
    {
      id: 7,
      title: "C++ 전문가 대결",
      description: "C++ / 그래프 / 전문가",
      players: "1/2",
      language: "C++",
      difficulty: "전문가",
      hostName: "CompilerKing",
      hostTier: "Diamond I",
    },
    {
      id: 8,
      title: "TypeScript 실전 코딩",
      description: "TypeScript / 문자열 / 중급",
      players: "1/2",
      language: "TypeScript",
      difficulty: "중급",
      hostName: "ScriptMaster",
      hostTier: "Platinum IV",
    },
    {
      id: 9,
      title: "React 컴포넌트 챌린지",
      description: "JavaScript / React / 중급",
      players: "0/2",
      language: "JavaScript",
      difficulty: "중급",
      hostName: "ReactPro",
      hostTier: "Gold II",
    },
    {
      id: 10,
      title: "SQL 쿼리 최적화",
      description: "SQL / 데이터베이스 / 고급",
      players: "1/2",
      language: "SQL",
      difficulty: "고급",
      hostName: "DBMaster",
      hostTier: "Platinum I",
    },
  ];

  

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽 섹션 */}
            <div className="flex flex-col space-y-6">
              {/* 실시간 코딩 대결 */}
              <CyberCard className="text-center">
                <h2 className="text-2xl font-bold text-cyber-blue mb-4">
                  실시간 코딩 대결
                </h2>
                <p className="text-gray-300 mb-6">
                  다른 개발자들과 코딩 실력을 겨뤄보세요!
                </p>
                <CyberButton
                  size="lg"
                  className="w-full max-w-sm mx-auto"
                  onClick={() =>
                    navigate("/matching", { state: { userId: user.user_id } })
                  }
                >
                  <Play className="h-5 w-5 mr-2" />
                  매칭 시작
                </CyberButton>
              </CyberCard>

              {/* 대기실 리스트 */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-cyber-blue">
                    대기실 리스트
                  </h2>
                  <CyberButton
                    size="sm"
                    onClick={() => setShowCreateRoom(true)}
                  >
                    + 대기실 생성
                  </CyberButton>
                </div>

                <div className="h-[500px] overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {waitingRooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Crown className="h-4 w-4 text-yellow-400" />
                              <span className="text-white font-medium">
                                {room.title}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  room.difficulty === "초급"
                                    ? "bg-green-500/20 text-green-400"
                                    : room.difficulty === "중급"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : room.difficulty === "고급"
                                        ? "bg-orange-500/20 text-orange-400"
                                        : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {room.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">
                              {room.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              호스트: {room.hostName} ({room.hostTier})
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">
                              {room.players}
                            </span>
                            <CyberButton
                              size="sm"
                              disabled={room.players === "2/2"}
                              onClick={() => navigate("/waiting-room")}
                            >
                              {room.players === "2/2" ? "대기중" : "입장"}
                            </CyberButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>
            </div>

            {/* 오른쪽 섹션 */}
            <div className="flex flex-col space-y-6">
              {/* 내 프로필 요약 */}
              <CyberCard className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 block opacity-100 visible">
                  {currentUser.name}
                </h3>
                <div className="text-sm text-gray-400 mb-4">
                  <span className={tier.color}>{tier.name}</span> • {user.rank}
                  위
                </div>
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-cyber-blue">
                    {lp} LP
                  </div>
                  <div className="text-sm text-gray-400">현재 LP</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      {user.wins}
                    </div>
                    <div className="text-sm text-gray-400">승리</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-400">
                      {user.losses}
                    </div>
                    <div className="text-sm text-gray-400">패배</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyber-blue">
                      {winRate}%
                    </div>
                    <div className="text-sm text-gray-400">승률</div>
                  </div>
                </div>
                <CyberButton
                  className="w-full"
                  onClick={() => navigate("/profile")}
                >
                  프로필 보기
                </CyberButton>
              </CyberCard>

              {/* TOP 랭킹 */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <h2 className="text-xl font-bold text-yellow-400">
                      TOP 랭킹
                    </h2>
                  </div>
                  <CyberButton size="sm" onClick={() => navigate("/ranking")}>
                    전체보기
                  </CyberButton>
                </div>

                <div className="h-80 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pr-4">
                      {topRanking.map((player) => {
                        const { tier: playerTier, lp: playerLp } =
                          parseTotalScore(player.mmr); // player.mmr 사용
                        return (
                          <div
                            key={player.rank}
                            className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8">
                                {player.rank === 1 && (
                                  <Crown className="h-5 w-5 text-yellow-400" />
                                )}
                                {player.rank === 2 && (
                                  <Trophy className="h-5 w-5 text-gray-300" />
                                )}
                                {player.rank === 3 && (
                                  <Star className="h-5 w-5 text-orange-400" />
                                )}
                                {player.rank > 3 && (
                                  <span className="text-white font-bold text-sm">
                                    #{player.rank}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-white font-medium">
                                  {player.nickname}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className={`text-xs ${playerTier.color}`}>
                                {playerTier.name}
                              </div>
                              <div className="text-right">
                                <div className="text-cyan-400 font-medium">
                                  {playerLp} LP
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>
            </div>
          </div>
        </div>
      </main>

      {showCreateRoom && (
        <CreateRoomModal
          isOpen={showCreateRoom}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
    </div>
  );
};

export default Index;