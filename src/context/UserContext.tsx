import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from "react";
import { authFetch, getUserWinRate, getUserAchievements } from "@/utils/api";
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
  const lastNotifiedAchievementId = useRef<number | null>(null);
  const accessToken = getCookie("access_token"); // accessToken을 여기로 이동

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
            // profileImageUrl: `${apiUrl}${userData.profile_img_url}`,
            profileImageUrl: `${userData.profile_img_url}`,
          };
          setUser(currentUserData);

          const achievementData = await getUserAchievements(currentUserData.user_id);
          const unclaimedAchievements = achievementData.filter(
            (ua) => !ua.is_reward_received
          );

          if (unclaimedAchievements.length > 0) {
            const firstUnclaimed = unclaimedAchievements[0];
            if (firstUnclaimed.user_achievement_id !== lastNotifiedAchievementId.current) {
                setNewlyAchieved(firstUnclaimed);
                lastNotifiedAchievementId.current = firstUnclaimed.user_achievement_id;
            }
          } else {
            setNewlyAchieved(null);
            lastNotifiedAchievementId.current = null;
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

    if (accessToken) {
      fetchUser();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [accessToken]);

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