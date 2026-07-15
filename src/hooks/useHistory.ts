import { useState, useCallback, useEffect } from 'react';
import { Blueprint } from '../types';
import { firestoreService } from '../services/firestoreService';

export const useHistory = () => {
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  const filteredHistory = history.filter(bp => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      bp.name?.toLowerCase().includes(searchLower) ||
      bp.pitch?.toLowerCase().includes(searchLower) ||
      bp.overview?.solution?.toLowerCase().includes(searchLower) ||
      bp.customers?.icp?.toLowerCase().includes(searchLower) ||
      bp.competitors?.some(c => c.name?.toLowerCase().includes(searchLower)) ||
      bp.product?.core_features?.some(f => f.toLowerCase().includes(searchLower)) ||
      bp.roadmap?.some(r => r.phase?.toLowerCase().includes(searchLower))
    );
  });

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
