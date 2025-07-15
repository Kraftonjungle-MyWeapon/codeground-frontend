import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { parseTotalScore } from "@/utils/lpSystem";
import { useUser } from "@/context/UserContext";
import { fetchUserlogs, getAllUserAchievements } from "@/utils/api";
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
  Sword
} from "lucide-react";
import { Achievement, UserAchievement } from "@/types/achievement";

const ProfilePage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [recentMatches, setRecentMatches] = useState<MatchLog[]>([]);
  const [logCount, setLogCount] = useState(0);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievedIds, setUserAchievedIds] = useState<Set<number>>(new Set());
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);

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

  const fetchAllAchievements = useCallback(async () => {
    if (!user?.user_id) return;
    setIsLoadingAchievements(true);
    try {
      const data = await getAllUserAchievements(user.user_id);
      setAllAchievements(data.all_achievements);
      const achievedIds = new Set(data.user_achievements.map(ua => ua.achievement.achievement_id));
      setUserAchievedIds(achievedIds);
    } catch (error) {
      console.error("Failed to fetch all achievements:", error);
    } finally {
      setIsLoadingAchievements(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (!isUserLoading && user?.user_id) {
      fetchAllAchievements();
    }
  }, [isUserLoading, user?.user_id, fetchAllAchievements]);

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

  const achievementsToDisplay = allAchievements.map(achievement => ({
    ...achievement,
    completed: userAchievedIds.has(achievement.achievement_id),
    icon: (() => {
      switch (achievement.trigger_type) {
        case 'TOTAL_WIN':
        case 'FIRST_WIN':
        case 'CONSECUTIVE_WIN': return Trophy;
        case 'TOTAL_LOSS':
        case 'CONSECUTIVE_LOSS': return Shield;
        case 'TOTAL_DRAW': return Sword;
        case 'PROBLEM_SOLVED': return Target;
        case 'WIN_WITHIN_N_SUBMISSIONS':
        case 'WIN_WITHOUT_MISS': return Zap;
        case 'FAST_WIN': return Flame;
        case 'APPROVED_PROBLEM_COUNT': return Medal;
        default: return Award;
      }
    })(),
    rarity: achievement.reward_type.toLowerCase(), // API의 reward_type을 소문자로 변환하여 rarity로 사용
  })).sort((a, b) => {
    // completed가 true인 업적을 먼저 정렬
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    // completed 상태가 같으면 achievement_id로 정렬 (안정적인 정렬을 위해)
    return a.achievement_id - b.achievement_id;
  });

  return (
    <div>
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
              <AchievementCollection achievements={achievementsToDisplay} />
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
