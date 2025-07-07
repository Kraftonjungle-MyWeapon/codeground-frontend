import { eraseCookie } from "@/lib/utils";
import { AwardIcon } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;
import { Problem, ProblemWithImages, MatchLog, UserLogsResult } from "@/types/codeEditor";

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const authInit: RequestInit = {
    ...init,
    credentials: "include", // Ensure cookies are sent with cross-origin requests
  };

  const response = await fetch(input, authInit);

  if (response.status === 401) {
    eraseCookie("access_token"); // This might not be necessary if the cookie is httponly, but good for cleanup
    window.location.href = "/login";
  }

  return response;
}

export async function getRankings(language: string = "python3") {
  const response = await authFetch(`${apiUrl}/api/v1/ranking/?language=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch rankings");
  }
  return response.json();
}


export async function getUserProfile() {
  const response = await authFetch(`${apiUrl}/api/v1/users/me`);
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
}

export async function updateUserProfile(nickname: string, use_lang: string) {
  const response = await authFetch(`${apiUrl}/api/v1/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname, use_lang }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  return response.json();
}

export async function getUserWinRate(userId: number) {
  const response = await authFetch(
    `${apiUrl}/api/v1/analysis/users/${userId}/win-rate`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user win rate");
  }
  return response.json();
}


export async function fetchProblemForGame(
  problemData: { problem_url: string; image_urls: string[] },
  game_id: number,
): Promise<void> {
  try {
    const problemResponse = await authFetch(problemData.problem_url);
    if (!problemResponse.ok) {
      throw new Error(`Failed to fetch problem from ${problemData.problem_url}`);
    }
    const problem: Problem = await problemResponse.json();

    const problemStatementImages = problemData.image_urls.map((url) => ({
      url: url,
      name: url.substring(url.lastIndexOf("/") + 1),
    }));

    const problemWithImages: ProblemWithImages = {
      ...problem,
      problemStatementImages,
    };

    localStorage.setItem(
      `problem_${game_id}`,
      JSON.stringify(problemWithImages),
    );
    console.log(`Problem for game ${game_id} saved to localStorage.`);
  } catch (error) {
    console.error("Error fetching problem from S3, attempting to fetch from DB:", error);
    try {
      // S3에서 실패했으므로, 로컬 DB에서 문제 ID 3번을 가져오도록 시도합니다.
      // 이 로직은 로컬 테스트 환경에서만 작동합니다.
      const problemFromDB: ProblemWithImages = await getProblemById(3);

      const problemStatementImages = problemData.image_urls.map((url) => ({
        url: url,
        name: url.substring(url.lastIndexOf("/") + 1),
      }));

      const problemWithImages: ProblemWithImages = {
        ...problemFromDB,
        problemStatementImages,
      };

      localStorage.setItem(
        `problem_${game_id}`,
        JSON.stringify(problemWithImages),
      );
      console.log(`Problem for game ${game_id} saved to localStorage from DB.`);
    } catch (dbError) {
      console.error("Error fetching problem from DB as fallback:", dbError);
      throw dbError; // DB에서도 실패하면 최종적으로 오류를 던집니다.
    }
  }
}


export async function getProblemById(problemId: number): Promise<ProblemWithImages> {
  console.log("getProblemById called with problemId:", problemId);
  const url = import.meta.env.VITE_API_URL.includes('localhost')
  const response = await authFetch(`${apiUrl}/api/v1/game/for_local`);
  if (!response.ok) {
    throw new Error("Failed to fetch problem from DB");
  }
  return response.json();
}


export async function fetchUserlogs(userId : number , count : number) : Promise<MatchLog[] | null> {
  const response = await authFetch(`${apiUrl}/api/v1/match/match_logs/${userId}/${count}`)

  //그냥 정말로 전적이 없을 때 
  if (response.status === 204 || response.status === 404) {
    return null;                     
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user logs");
  }
  return (await response.json()) as MatchLog[]; 
}

