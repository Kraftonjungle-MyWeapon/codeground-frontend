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
