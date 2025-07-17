import { eraseCookie } from "@/lib/utils";
import { Problem, ProblemWithImages, MatchLog } from "@/types/codeEditor";
import { ResponseRoom, CustomRoom, RoomCreateRequest } from "@/types/room";
import { AllAchievementsResponse } from "@/types/achievement";

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
export async function updateUserProfile(formData: FormData) {
  const response = await authFetch(`${apiUrl}/api/v1/user/me`, {
    method: "PUT",
    body: formData,
  });
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
  game_id: number,
  problemIdFromBackend: string // 새로운 인자 추가
): Promise<void> {
  if (import.meta.env.MODE === "development") {
    try {
      const problemWithImages: ProblemWithImages = await getProblemById(3);

      sessionStorage.setItem(
        `problem_${game_id}`,
        JSON.stringify({ ...problemWithImages, problem_id: problemIdFromBackend }) // problem_id 덮어쓰기
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
        JSON.stringify({ ...problemWithImages, problem_id: problemIdFromBackend }) // problem_id 덮어쓰기
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
  
  const problemData: Problem = await response.json();

  // 목업 이미지 URL 생성 (public/tiers 폴더의 이미지 활용)
  const mockImageUrls = [
    "/tiers/bronze.png",
    "/tiers/silver.png",
    "/tiers/gold.png",
  ];

  const problemStatementImages = mockImageUrls.map((url, index) => ({
    url: url,
    name: `img_${index}`, // 태그에 사용할 이름
  }));

  // description에 이미지 태그 삽입
  let modifiedDescription = problemData.description;
  problemStatementImages.forEach((image, index) => {
    modifiedDescription += `\n[IMAGE:${image.name}]`;
  });

  const problemWithImages: ProblemWithImages = {
    ...problemData,
    description: modifiedDescription,
    problemStatementImages: problemStatementImages,
  };

  return problemWithImages;
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

/**
 * 비밀번호 변경
 */
export async function changePassword(current_password, new_password) {
  const response = await authFetch(`${apiUrl}/api/v1/users/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ current_password, new_password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to change password");
  }

  return response.json();
}



/**
 * 문제 생성
 */
export async function createProblem(problemData: FormData) {
  const response = await authFetch(`${apiUrl}/api/v1/problem/`, {
    method: "POST",
    body: problemData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create problem");
  }

  return response.json();
}

/**
 * 방 생성
 */
export async function createRoom(roomData: RoomCreateRequest, userId: number) {
  const response = await authFetch(`${apiUrl}/api/v1/create_room/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create room");
  }

  return response.json();
}

/**
 * 방 목록 조회
 */
export async function getRooms(page: number): Promise<ResponseRoom[]> {
  const response = await authFetch(`${apiUrl}/api/v1/rooms/${page}`);
  if (!response.ok) throw new Error("Failed to fetch rooms");
  return response.json();
}

/**
 * 방 정보 조회
 */
export async function getRoomInfo(roomId: number): Promise<CustomRoom> {
  const response = await authFetch(`${apiUrl}/api/v1/get_room/${roomId}`);
  if (!response.ok) throw new Error("Failed to fetch room info");
  return response.json();
}

/**
 * 방 정보 업데이트
 */
export async function updateRoom(roomId: number, userId: number, updateData: { [key: string]: any }): Promise<CustomRoom> {
  const response = await authFetch(`${apiUrl}/api/v1/update_room/${roomId}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update room");
  }

  return response.json();
}

/**
 * 방 입장
 */
export async function joinRoom(roomId: number, userId: number): Promise<CustomRoom> {
  const response = await authFetch(`${apiUrl}/api/v1/join_room/${roomId}/${userId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to join room");
  }

  return response.json();
}

/**
 * 방 나가기
 */
export async function leaveRoom(roomId: number, userId: number): Promise<void> {
  const response = await authFetch(`${apiUrl}/api/v1/leave_room/${roomId}/${userId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to leave room");
  }
}


/**
 * 유저 업적 정보 가져오기
 */
export async function getUserAchievements(userId: number) {
  const response = await authFetch(`${apiUrl}/api/v1/achievements/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user achievements");
  }
  return response.json();
}

/**
 * 업적 보상 수령 처리
 */
export async function claimAchievementReward(userId: number, userAchievementId: number) {
  const response = await authFetch(
    `${apiUrl}/api/v1/achievements/users/${userId}/achievements/${userAchievementId}/reward-received`,
    {
      method: "PATCH",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to claim achievement reward");
  }
  return response.json();
}

/**
 * 모든 업적 및 유저 획득 업적 정보 가져오기
 */
export async function getAllUserAchievements(userId: number): Promise<AllAchievementsResponse> {
  const response = await authFetch(`${apiUrl}/api/v1/achievements/users/${userId}/all-achievements`);
  if (!response.ok) {
    throw new Error("Failed to fetch all user achievements");
  }
  return response.json();
}