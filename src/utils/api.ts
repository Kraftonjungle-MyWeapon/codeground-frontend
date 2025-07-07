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
    console.error("Error fetching or saving problem data:", error);
    throw error;
  }
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

