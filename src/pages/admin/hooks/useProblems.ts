import { useEffect, useState } from 'react';
import { fetchProblems } from '../api/adminApi';

export interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string[];
  status: string;
  submissions: number;
  successRate: string;
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    fetchProblems()
      .then(setProblems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { problems, loading, error };
}