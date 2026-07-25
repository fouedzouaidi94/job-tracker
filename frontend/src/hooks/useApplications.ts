import { useState, useEffect } from 'react';
import axios from 'axios';
import { Application, ApplicationInput } from '../types';

const API = 'https://job-tracker-api-9xg2.onrender.com/api/applications';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Application[]>(API);
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const create = async (input: ApplicationInput) => {
    const { data } = await axios.post<Application>(API, input);
    setApplications(prev => [data, ...prev]);
    return data;
  };

  const update = async (id: number, input: ApplicationInput) => {
    const { data } = await axios.put<Application>(`${API}/${id}`, input);
    setApplications(prev => prev.map(a => a.id === id ? data : a));
    return data;
  };

  const remove = async (id: number) => {
    await axios.delete(`${API}/${id}`);
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => { fetchAll(); }, []);

  return { applications, loading, error, create, update, remove, refetch: fetchAll };
}
