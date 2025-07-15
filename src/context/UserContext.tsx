import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authFetch, getUserWinRate, getAllUserAchievements } from "@/utils/api";
import { getCookie } from "@/lib/utils";
import { UserAchievement } from "@/types/achievement";

interface User {
  email: string;  
  username: string;
  user_id: number;
  nickname: string;
  role: string;
  use_lang?: string;
  name?: string;
  totalScore?: number;
  win?: number;
  loss?: number;
  draw?: number;
  win_rate?: number;
  totalBattles?: number;
  currentStreak?: number;
  bestStreak?: number;
  rank?: number;
  favoriteLanguage?: string;
  averageTime?: string;
  bestTime?: string;
  joinDate?: string;
  profileImageUrl?: string;   // 이걸 추가해야 실사용 가능
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isError: boolean;
  newlyAchieved: UserAchievement | null;
  setNewlyAchieved: (achievement: UserAchievement | null) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
const apiUrl = import.meta.env.VITE_API_URL;
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [newlyAchieved, setNewlyAchieved] = useState<UserAchievement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await authFetch(`${apiUrl}/api/v1/user/me`);
        if (response.ok) {
          const userData = await response.json();
          const winRateData = await getUserWinRate(userData.user_id);
          const currentUserData = {
            ...userData,
            ...winRateData,
            rank : userData.user_rank,
            totalScore: userData.user_mmr,
            name: userData.nickname,
            profileImageUrl: `${apiUrl}${userData.profile_img_url}`,
          };
          setUser(currentUserData);

          // Fetch achievements and check for unclaimed ones
          const achievementData = await getAllUserAchievements(currentUserData.user_id);
          const unclaimedAchievements = achievementData.user_achievements.filter(
            (ua) => !ua.is_reward_received
          );

          if (unclaimedAchievements.length > 0) {
            // Only set if it's different from the currently notified one
            // This prevents re-notifying the same achievement if the user hasn't dismissed the toast yet
            if (!newlyAchieved || newlyAchieved.user_achievement_id !== unclaimedAchievements[0].user_achievement_id) {
                setNewlyAchieved(unclaimedAchievements[0]);
            }
          } else {
            // If no unclaimed achievements, ensure newlyAchieved is null
            setNewlyAchieved(null);
          }

        } else {
          console.error("Failed to fetch user data:", response.statusText);
          setUser(null);
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const accessToken = getCookie("access_token");
    if (accessToken) {
      fetchUser();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [getCookie("access_token")]); // accessToken 변경 시 fetchUser 재실행

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading, isError, newlyAchieved, setNewlyAchieved }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};