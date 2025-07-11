import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { parseTotalScore } from "@/utils/lpSystem";
import { useUser } from "@/context/UserContext";
import { fetchUserlogs } from "@/utils/api";
import { MatchLog } from "@/types/codeEditor";
import UserInfoCard from "./components/UserInfoCard";
import GameStatsCard from "./components/GameStatsCard";
import MatchHistory from "./components/MatchHistory";
import AchievementCollection from "./components/AchievementCollection";
import ProfileEditModal from "./components/ProfileEditModal";
import {
  Trophy,
  Target,
  Award,
  Medal,
  Crown,
  Zap,
  Shield,
  Star,
  Flame,
  User,
  Gem,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [recentMatches, setRecentMatches] = useState<MatchLog[]>([]);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    const getRecentMatches = async () => {
      if (user?.user_id) {
        try {
          const logs = await fetchUserlogs(user.user_id, logCount);
          setRecentMatches(logs || []);
        } catch (error) {
          console.error("Failed to fetch user logs:", error);
          setRecentMatches([]);
        }
      }
    };

    getRecentMatches();
  }, [user?.user_id, logCount]);

  const currentUser = {
    user_id: user?.user_id || 0,
    username: user?.username || "CyberCoder", // ✅ 진짜 username = 본명
    nickname: user?.nickname || "CyberCoder", // ✅ 닉네임 따로 관리
    email: user?.email || "cybercoder@example.com",
    joinDate: "2024-01-15",
    totalScore: user?.totalScore || 1580,
    wins: user?.win ?? 0,
    losses: user?.loss ?? 0,
    draws: user?.draw ?? 0,
    totalBattles: (user?.win ?? 0) + (user?.loss ?? 0) + (user?.draw ?? 0),
    currentStreak: 5,
    bestStreak: 12,
    rank: 15,
    favoriteLanguage: user?.use_lang || "Python",
    averageTime: "4:32",
    bestTime: "1:47",
  };

  const { tier, lp } = parseTotalScore(currentUser.totalScore);
  const winRate = user?.win_rate != null ? user.win_rate.toFixed(2) : "0.00";

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

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-6">
              <UserInfoCard
                nickname={currentUser.nickname}
                profileImageUrl={user?.profileImageUrl}
                rank={currentUser.rank}
                tier={tier}
                lp={lp}
                onEdit={() => setShowEditModal(true)}
              />
              <GameStatsCard
                totalBattles={currentUser.totalBattles}
                wins={currentUser.wins}
                losses={currentUser.losses}
                winRate={winRate}
                averageTime={currentUser.averageTime}
                bestTime={currentUser.bestTime}
                currentStreak={currentUser.currentStreak}
                bestStreak={currentUser.bestStreak}
              />
            </div>
            <div className="lg:col-span-2 flex flex-col space-y-6">
              <MatchHistory matches={recentMatches} />
              <AchievementCollection achievements={allAchievements} />
            </div>
          </div>
        </div>
      </main>
      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentNickname={currentUser.nickname}
          currentProfileImageUrl={user?.profileImageUrl || ""}
        />
      )}
    </div>
  );
};

export default ProfilePage;
