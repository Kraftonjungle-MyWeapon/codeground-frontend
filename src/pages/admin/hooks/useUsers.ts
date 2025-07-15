import { useEffect, useState, useCallback } from 'react';
import { fetchUsers as fetchUsersApi } from '../api/adminApi';

export interface User {
  user_id: number;
  nickname: string;
  email: string;
  tier: string;
  is_banned: boolean;
  report_count: number;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetchUsersApi()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers }; 
}
