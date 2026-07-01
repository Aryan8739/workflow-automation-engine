import { useState } from 'react';
import api from '../lib/api';

export function useRunHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchHistory = async (workflowId) => {
    if (!workflowId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/runs?workflowId=${workflowId}`);
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, fetchHistory };
}
