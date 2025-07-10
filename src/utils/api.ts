import { eraseCookie } from "@/lib/utils";
import { AwardIcon } from "lucide-react";
import { Problem, ProblemWithImages, MatchLog } from "@/types/codeEditor";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * ✅ 인증 fetch – HttpOnly 쿠키 기반 요청
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const authInit: RequestInit = {
    ...init,
    credentials: "include", // ✅ 쿠키 자동 첨부
  };

  const response = await fetch(input, authInit);

  return response;
}

/**
 * 랭킹 데이터 요청
 */
export async function getRankings(language: string = "python3") {
  const response = await authFetch(
    `${apiUrl}/api/v1/ranking/?language=${language}`
  );
  if (!response.ok) throw new Error("Failed to fetch rankings");
  return response.json();
}

/**
 * 사용자 프로필 요청
 */
export async function getUserProfile() {
  const response = await authFetch(`${apiUrl}/api/v1/user/me`);
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
}

/**
 * 사용자 프로필 수정
 */
export async function updateUserProfile(nickname: string, use_lang: string) {
  const response = await authFetch(`${apiUrl}/api/v1/user/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname, use_lang }),
  });

  if (!response.ok) throw new Error("Failed to update user profile");
  return response.json();
}

/**
 * 승률 조회
 */
export async function getUserWinRate(userId: number) {
  const response = await authFetch(
    `${apiUrl}/api/v1/analysis/users/${userId}/win-rate`
  );
  if (!response.ok) throw new Error("Failed to fetch user win rate");
  return response.json();
}

/**
 * 게임 문제 가져오기 (S3 → DB fallback)
 */
export async function fetchProblemForGame(
  problemData: { problem_url: string; image_urls: string[] },
  game_id: number
): Promise<void> {
  if (import.meta.env.MODE === "development") {
    try {
      const problemFromDB: ProblemWithImages = await getProblemById(3);
      const problemStatementImages = (problemData.image_urls || [])
        .filter((url): url is string => typeof url === "string" && url.trim() !== "")
        .map((url) => ({
          url,
          name: url.substring(url.lastIndexOf("/") + 1),
        }));

      const problemWithImages: ProblemWithImages = {
        ...problemFromDB,
        problemStatementImages,
      };

      sessionStorage.setItem(
        `problem_${game_id}`,
        JSON.stringify(problemWithImages)
      );
      console.log(
        `Problem for game ${game_id} saved to localStorage from DB (development mode).`
      );
    } catch (dbError) {
      console.error("DB fallback failed in development mode:", dbError);
      throw dbError;
    }
  } else {
    // S3 presigned URL은 인증 헤더가 필요 없으므로 일반 fetch를 사용합니다.
    try {
      const problemResponse = await fetch(problemData.problem_url);
      console.log(problemResponse);
      if (!problemResponse.ok) {
        throw new Error(
          `Failed to fetch problem from ${problemData.problem_url}`
        );
      }
      const problem: Problem = await problemResponse.json();

      const problemStatementImages = (problemData.image_urls || [])
        .filter((url): url is string => typeof url === "string" && url.trim() !== "")
        .map((url) => ({
          url,
          name: url.substring(url.lastIndexOf("/") + 1),
        }));

      const problemWithImages: ProblemWithImages = {
        ...problem,
        problemStatementImages,
      };

      sessionStorage.setItem(
        `problem_${game_id}`,
        JSON.stringify(problemWithImages)
      );
      console.log(`Problem for game ${game_id} saved to localStorage.`);
    } catch (error) {
      console.error("Error fetching problem from S3:", error);
      throw error;
    }
  }
}

/**
 * 로컬 DB에서 문제 가져오기 (로컬 테스트용)
 */
export async function getProblemById(
  problemId: number
): Promise<ProblemWithImages> {
  console.log("getProblemById called with problemId:", problemId);
  const response = await authFetch(`${apiUrl}/api/v1/game/for_local`);
  if (!response.ok) throw new Error("Failed to fetch problem from DB");
  return response.json();
}

/**
 * 유저 전적 조회
 */
export async function fetchUserlogs(
  userId: number,
  count: number
): Promise<MatchLog[] | null> {
  const response = await authFetch(
    `${apiUrl}/api/v1/match/match_logs/${userId}/${count}`
  );

  if (response.status === 204 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user logs");
  }

  return (await response.json()) as MatchLog[];
}
