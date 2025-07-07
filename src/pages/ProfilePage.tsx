import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import ProfileEditModal from "@/components/ProfileEditModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  Award,
  Medal,
  Crown,
  Zap,
  Shield,
  Star,
  Flame,
  Gem,
} from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";
import { useUser } from "../context/UserContext";
import { fetchUserlogs } from "@/utils/api";
import { MatchLog } from "@/types/codeEditor";

const ProfilePage = () => {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [recentMatches, setRecentMatches] = useState<MatchLog[]>([]);
  const [logCount, setLogCount] = useState(0); // 초기 카운트 0

  useEffect(() => {
    const getRecentMatches = async () => {
      if (user?.user_id) {
        try {
          const logs = await fetchUserlogs(user.user_id, logCount);
          if (logs) {
            setRecentMatches(logs);
          } else {
            setRecentMatches([]); // 전적이 없을 경우 빈 배열로 설정
          }
        } catch (error) {
          console.error("Failed to fetch user logs:", error);
          setRecentMatches([]); // 에러 발생 시 빈 배열로 설정
        }
      }
    };

    getRecentMatches();
  }, [user?.user_id, logCount]);

  const currentUser = {
    user_id: user?.user_id || 0,
    username: user?.nickname || 'CyberCoder',
    email: user?.email || 'cybercoder@example.com',
    joinDate: '2024-01-15', // Not available from backend, keeping dummy
    totalScore: user?.totalScore || 1580,
    wins: user?.win ?? 0,
    losses: user?.loss ?? 0,
    draws: user?.draw ?? 0,
    totalBattles: (user?.win ?? 0) + (user?.loss ?? 0) + (user?.draw ?? 0),
    currentStreak: 5, // Not available from backend, keeping dummy
    bestStreak: 12, // Not available from backend, keeping dummy
    rank: 15, // Not available from backend, keeping dummy
    favoriteLanguage: user?.use_lang || "Python",
    averageTime: "4:32", // Not available from backend, keeping dummy
    bestTime: "1:47", // Not available from backend, keeping dummy
  };

  const { tier, lp } = parseTotalScore(currentUser.totalScore);
  const winRate = user?.win_rate != null ? user.win_rate.toFixed(2) : "0.00";

  // 모든 뱃지 데이터 (획득/미획득 포함)
  const allAchievements = [
    {
      id: 1,
      title: "첫 승리",
      description: "첫 대결에서 승리하기",
      completed: true,
      icon: Trophy,
      rarity: "common",
    },
    {
      id: 2,
      title: "연승왕",
      description: "5연승 달성하기",
      completed: true,
      icon: Flame,
      rarity: "rare",
    },
    {
      id: 3,
      title: "속도왕",
      description: "2분 이내 문제 해결하기",
      completed: true,
      icon: Zap,
      rarity: "epic",
    },
    {
      id: 4,
      title: "완벽주의자",
      description: "정확도 100% 10회 달성",
      completed: true,
      icon: Target,
      rarity: "rare",
    },
    {
      id: 5,
      title: "실버 등급",
      description: "실버 티어 달성하기",
      completed: true,
      icon: Medal,
      rarity: "common",
    },
    {
      id: 6,
      title: "골드 등급",
      description: "골드 티어 달성하기",
      completed: true,
      icon: Award,
      rarity: "uncommon",
    },
    {
      id: 7,
      title: "플래티넘 등급",
      description: "플래티넘 티어 달성하기",
      completed: false,
      icon: Shield,
      rarity: "epic",
    },
    {
      id: 8,
      title: "다이아몬드 등급",
      description: "다이아몬드 티어 달성하기",
      completed: false,
      icon: Gem,
      rarity: "legendary",
    },
    {
      id: 9,
      title: "마스터 등급",
      description: "마스터 티어 달성하기",
      completed: false,
      icon: Crown,
      rarity: "legendary",
    },
    {
      id: 10,
      title: "100전 100승",
      description: "100승 달성하기",
      completed: false,
      icon: Star,
      rarity: "epic",
    },
    {
      id: 11,
      title: "언어 마스터",
      description: "5개 언어로 승리하기",
      completed: false,
      icon: User,
      rarity: "rare",
    },
    {
      id: 12,
      title: "전설의 연승",
      description: "20연승 달성하기",
      completed: false,
      icon: Flame,
      rarity: "legendary",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "bronze":
        return "text-orange-400";
      case "silver":
        return "text-gray-400";
      case "gold":
        return "text-yellow-400";
      case "platinum":
        return "text-blue-400";
      case "diamond":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-400";
      case "loss":
        return "text-red-400";
      case "draw":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getBadgeRarityColor = (rarity: string, completed: boolean) => {
    if (!completed) return "text-gray-500 bg-gray-800/50";

    switch (rarity) {
      case "common":
        return "text-gray-300 bg-gray-600/30";
      case "uncommon":
        return "text-green-400 bg-green-500/20";
      case "rare":
        return "text-blue-400 bg-blue-500/20";
      case "epic":
        return "text-purple-400 bg-purple-500/20";
      case "legendary":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-gray-300 bg-gray-600/30";
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 프로필 기본 정보 */}
            <div className="flex flex-col space-y-6">
              <CyberCard className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentUser.username}
                </h1>
                <div className="text-gray-400 text-sm mb-4">
                  <span className={tier.color}>{tier.name}</span> • 전체랭킹{" "}
                  {currentUser.rank}위
                </div>
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-cyber-blue">
                    {lp} LP
                  </div>
                  <div className="text-sm text-gray-400">총 포인트</div>
                </div>
                <CyberButton
                  onClick={() => setShowEditModal(true)}
                  className="w-full"
                >
                  프로필 편집
                </CyberButton>
              </CyberCard>

              {/* 게임 통계 */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-pink-400" />
                  <h2 className="text-lg font-bold text-white">게임 통계</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-white">
                      {currentUser.totalBattles}
                    </div>
                    <div className="text-sm text-gray-400">총게임</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {currentUser.wins}
                    </div>
                    <div className="text-sm text-gray-400">승리</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-red-400">
                      {currentUser.losses}
                    </div>
                    <div className="text-sm text-gray-400">패배</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-yellow-400">
                      {winRate}%
                    </div>
                    <div className="text-sm text-gray-400">승률</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-purple-400">
                      {currentUser.averageTime}
                    </div>
                    <div className="text-sm text-gray-400">평균 시간</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-cyan-400">
                      {currentUser.bestTime}
                    </div>
                    <div className="text-sm text-gray-400">최단 시간</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-orange-400">
                      {currentUser.currentStreak}
                    </div>
                    <div className="text-sm text-gray-400">현재 연승</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-pink-400">
                      {currentUser.bestStreak}
                    </div>
                    <div className="text-sm text-gray-400">최고 연승</div>
                  </div>
                </div>
              </CyberCard>
            </div>

            {/* 오른쪽: 최근 전적과 명예 */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              {/* 최근 전적 */}
              <CyberCard>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">최근 전적</h2>
                </div>

                <div className="h-80 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pr-4">
                      {recentMatches.length > 0 ? (
                        recentMatches.map((match, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[min-content_1fr_2fr_8rem_6rem] gap-4 p-3 bg-black/20 rounded-lg text-sm"
                          >
                            <div
                              className={`font-bold ${getResultColor(match.result || '')} border-r border-gray-700/50 pr-4 w-16 text-center`}
                            >
                              {match.result}
                            </div>
                            <div className={`${getResultColor(match.result || '')} border-r border-gray-700/50 pr-4`}>
                              vs {match.opponent_name} ({match.opponent_tier})
                            </div>
                            <div className={`${getDifficultyColor(match.game_difficulty)} truncate overflow-hidden border-r border-gray-700/50 pr-4`}>
                              {match.game_title}
                            </div>
                            <div className="text-gray-400 border-r border-gray-700/50 pr-4">
                              {(() => {
                                const date = new Date(match.game_time);
                                const year = date.getFullYear().toString().slice(-2);
                                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                const day = date.getDate().toString().padStart(2, '0');
                                const hours = date.getHours().toString().padStart(2, '0');
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                return `${year}.${month}.${day} ${hours}:${minutes}`;
                              })()}
                            </div>
                            <div
                              className={`${getResultColor(match.result || '')}`}
                            >
                              {match.mmr_earned > 0 ? '+' : ''}{match.mmr_earned} LP
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-10">
                          경기 전적 없음
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>

              {/* 명예 (모든 배지) */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-6">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-lg font-bold text-white">명예 컬렉션</h2>
                  <span className="text-sm text-gray-400">
                    ({allAchievements.filter((a) => a.completed).length}/
                    {allAchievements.length})
                  </span>
                </div>

                <div className="h-64 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                      {allAchievements.map((achievement) => {
                        const IconComponent = achievement.icon;
                        return (
                          <div
                            key={achievement.id}
                            className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                              achievement.completed
                                ? `${getBadgeRarityColor(achievement.rarity, true)} hover:scale-105 border-current/30`
                                : "bg-gray-800/30 border-gray-700/50 opacity-60"
                            }`}
                          >
                            <IconComponent
                              className={`h-8 w-8 mb-2 ${
                                achievement.completed
                                  ? getBadgeRarityColor(
                                      achievement.rarity,
                                      true,
                                    ).split(" ")[0]
                                  : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium text-center mb-1 ${
                                achievement.completed
                                  ? "text-white"
                                  : "text-gray-500"
                              }`}
                            >
                              {achievement.title}
                            </span>
                            <span
                              className={`text-xs text-center ${
                                achievement.completed
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {achievement.description}
                            </span>
                            {achievement.completed && (
                              <CheckCircle className="h-4 w-4 text-green-400 mt-2" />
                            )}
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

      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUsername={currentUser.username}
        />
      )}
    </div>
  );
};

export default ProfilePage;