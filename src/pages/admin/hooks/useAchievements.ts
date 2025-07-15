import { useEffect, useState } from 'react';
import { fetchAchievements } from '../api/adminApi';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  rarity: string;
  unlocked: number;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    fetchAchievements()
      .then(setAchievements)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { achievements, loading, error };
}
