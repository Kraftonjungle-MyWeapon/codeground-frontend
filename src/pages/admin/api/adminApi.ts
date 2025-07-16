// src/pages/admin/api/adminApi.ts

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api/v1";

export async function fetchAchievements() {
  const response = await fetch(`${API_BASE_URL}/admin/achievements`);
  if (!response.ok) throw new Error('업적 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function fetchReports() {
  const response = await fetch(`${API_BASE_URL}/admin/reports`);
  if (!response.ok) throw new Error('신고 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function fetchProblems() {
  const response = await fetch(`${API_BASE_URL}/admin/problems`);
  if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function fetchUsers() {
  const response = await fetch(`${API_BASE_URL}/admin/users`);
  if (!response.ok) throw new Error('유저 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function banUser(userId: number) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('유저 정지에 실패했습니다');
  return response.json();
}

export async function unbanUser(user_id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${user_id}/unban`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('정지 해제에 실패했습니다');
  return response.json();
}