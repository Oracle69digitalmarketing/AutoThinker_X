import { useState, useCallback } from 'react';
import { Blueprint } from '../types';
import { firestoreService } from '../services/firestoreService';

export const useHistory = () => {
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const docs = await firestoreService.fetchBlueprints();
      setHistory(docs);
    } catch (error) {
      // Error handled in firestoreService
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const deleteHistory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blueprint?")) return false;
    try {
      await firestoreService.deleteBlueprint(id);
      setHistory(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (error) {
      return false;
    }
  };

  const refreshHistory = () => {
    console.log("Refreshing data...");
    fetchHistory();
  };

  const filteredHistory = history.filter(bp => 
    bp.name?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    history,
    setHistory,
    historyLoading,
    search,
    setSearch,
    filteredHistory,
    fetchHistory,
    deleteHistory,
    refreshHistory
  };
};
