import { getCookie, eraseCookie } from "@/lib/utils";

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = getCookie("access_token");
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const authInit: RequestInit = {
    ...init,
    headers,
  };

  const response = await fetch(input, authInit);

  if (response.status === 401) {
    eraseCookie("access_token");
    window.location.href = "/login";
  }

  return response;
}

export async function getRankings(language: string = "python3") {
  const response = await authFetch(`http://localhost:8000/api/v1/ranking/?language=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch rankings");
  }
  return response.json();
}


export async function getUserProfile() {
  const response = await authFetch("http://localhost:8000/api/v1/users/me");
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
}

export async function updateUserProfile(nickname: string, use_lang: string) {
  const response = await authFetch("http://localhost:8000/api/v1/users/me", {
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
    `http://localhost:8000/api/v1/analysis/users/${userId}/win-rate`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user win rate");
  }
  return response.json();
}