import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authFetch, getUserWinRate } from "@/utils/api";

interface User {
  email: string;
  username: string;
  user_id: number;
  nickname: string;
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
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isError: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const apiUrl = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await authFetch(`${apiUrl}/api/v1/user/me`);
        if (response.ok) {
          const userData = await response.json();
          const winRateData = await getUserWinRate(userData.user_id);

          setUser({
            ...userData,
            ...winRateData,
            rank : userData.user_rank,
            totalScore: userData.user_mmr,
            name: userData.nickname,
          });
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

    fetchUser(); // ✅ 무조건 호출. 성공 여부로 인증 상태 판단
  }, []); // ✅ 불필요한 의존성 제거

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading, isError }}>
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
