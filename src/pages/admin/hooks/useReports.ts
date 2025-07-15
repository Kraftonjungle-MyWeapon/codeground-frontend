import { useEffect, useState } from 'react';
import { fetchReports } from '../api/adminApi';

export interface Report {
  id: number;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: string;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading, error };
}
