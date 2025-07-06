import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export async function getRankings(language: string = "python3") {
  const response = await api.get(`/api/v1/ranking/?language=${language}`);
  return response.data;
}

export async function getUserProfile() {
  const response = await api.get(`/api/v1/users/me`);
  return response.data;
}

export async function updateUserProfile(nickname: string, use_lang: string) {
  const response = await api.put(`/api/v1/users/me`, { nickname, use_lang });
  return response.data;
}

export async function getUserWinRate(userId: number) {
  const response = await api.get(`/api/v1/analysis/users/${userId}/win-rate`);
  return response.data;
}
