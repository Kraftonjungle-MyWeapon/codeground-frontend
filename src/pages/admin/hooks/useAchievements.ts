import { useEffect, useState } from 'react';
import { fetchAchievements } from '../api/adminApi';

export interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  achievement_category_id?: number; // 카테고리 ID 필드 추가
  trigger_type: string;
  parameter: number;
  reward_type: string;
  reward_amount: number;
  prerequisite_achievement_ids?: number[];
  created_at: string;
  updated_at: string;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const refreshAchievements = () => {
    setLoading(true);
    setError(null);
    fetchAchievements()
      .then(setAchievements)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshAchievements();
  }, []);

  return { achievements, loading, error, refreshAchievements };
}
