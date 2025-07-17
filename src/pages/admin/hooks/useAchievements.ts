import { useEffect, useState } from 'react';
import { fetchAchievements } from '../api/adminApi';

export interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  trigger_type: string;
  parameter: number;
  reward_type: string;
  reward_amount: number;
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
