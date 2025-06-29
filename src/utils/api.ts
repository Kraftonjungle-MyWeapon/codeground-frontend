export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const authInit: RequestInit = {
    ...init,
    headers,
  };

  return fetch(input, authInit);
}
