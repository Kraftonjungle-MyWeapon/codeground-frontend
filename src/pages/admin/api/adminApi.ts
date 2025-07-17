import { Achievement } from '../hooks/useAchievements';

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchAchievements() {
  const response = await fetch(`${apiUrl}/api/v1/admin/achievements`);
  if (!response.ok) throw new Error('업적 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function createAchievement(achievementData: Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>) {
  const response = await fetch(`${apiUrl}/api/v1/admin/achievements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...achievementData,
      trigger_type: achievementData.trigger_type.toLowerCase(),
      reward_type: achievementData.reward_type.toLowerCase(),
    }),
  });
  if (!response.ok) throw new Error('업적 생성에 실패했습니다');
  return response.json();
}

export async function getAchievement(achievementId: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/achievements/${achievementId}`);
  if (!response.ok) throw new Error('업적 상세 정보를 불러오지 못했습니다');
  return response.json();
}

export async function updateAchievement(achievementId: number, achievementData: Omit<Achievement, 'achievement_id' | 'created_at' | 'updated_at'>) {
  const response = await fetch(`${apiUrl}/api/v1/admin/achievements/${achievementId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...achievementData,
      trigger_type: achievementData.trigger_type.toLowerCase(),
      reward_type: achievementData.reward_type.toLowerCase(),
    }),
  });
  if (!response.ok) throw new Error('업적 수정에 실패했습니다');
  return response.json();
}

export async function deleteAchievement(achievementId: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/achievements/${achievementId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('업적 삭제에 실패했습니다');
  return response.json();
}

export async function fetchReports() {
  const response = await fetch(`${apiUrl}/api/v1/admin/reports`);
  if (!response.ok) throw new Error('신고 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function fetchProblems() {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems`);
  if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function fetchUsers() {
  const response = await fetch(`${apiUrl}/api/v1/admin/users`);
  if (!response.ok) throw new Error('유저 데이터를 불러오지 못했습니다');
  return response.json();
}

export async function banUser(userId: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/ban`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('유저 정지에 실패했습니다');
  return response.json();
}

export async function unbanUser(user_id: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/users/${user_id}/unban`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('정지 해제에 실패했습니다');
  return response.json();
}

// 문제 관리 API
export async function fetchAdminProblems() {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems`);
  if (!response.ok) throw new Error('문제 목록을 불러오지 못했습니다');
  return response.json();
}

export async function fetchAdminProblemDetail(problemId: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems/${problemId}`);
  if (!response.ok) throw new Error('문제 상세 정보를 불러오지 못했습니다');
  return response.json();
}

export async function updateAdminProblem(problemId: number, formData: FormData) {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems/${problemId}`, {
    method: 'PATCH',
    body: formData, // multipart/form-data
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '문제 수정에 실패했습니다');
  }
  return response.json();
}

export async function deleteAdminProblem(problemId: number) {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems/${problemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '문제 삭제에 실패했습니다');
  }
  return response; // 204 No Content 응답을 위해 response 자체를 반환
}

export async function toggleProblemApproval(problemId: number, isApproved: boolean) {
  const response = await fetch(`${apiUrl}/api/v1/admin/problems/${problemId}/approve?is_approved=${isApproved}`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '문제 승인 상태 변경에 실패했습니다');
  }
  return response.json();
}