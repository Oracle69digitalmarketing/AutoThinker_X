import { useState, useCallback, useEffect } from 'react';
import { Blueprint } from '../types';
import { firestoreService } from '../services/firestoreService';

export type SortOption = 'newest' | 'oldest' | 'alphabetical';

export const useHistory = () => {
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Advanced filters
  const [filters, setFilters] = useState({
    branding: 'all',
    funding: 'all',
    industry: 'all'
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');

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

  const duplicateBlueprint = async (blueprint: Blueprint) => {
    try {
      const duplicated = { 
        ...blueprint, 
        name: `${blueprint.name} (Copy)`,
        updatedAt: new Date().toISOString()
      };
      delete duplicated.id;
      const id = await firestoreService.saveBlueprint(duplicated);
      const saved = { ...duplicated, id };
      setHistory(prev => [saved, ...prev]);
      return saved;
    } catch (error) {
      console.error("Duplication failed", error);
      return null;
    }
  };

  const refreshHistory = () => {
    fetchHistory();
  };

  const filteredHistory = history
    .filter(bp => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch || (
        bp.name?.toLowerCase().includes(searchLower) ||
        bp.pitch?.toLowerCase().includes(searchLower) ||
        bp.overview?.solution?.toLowerCase().includes(searchLower)
      );

      const matchesBranding = filters.branding === 'all' || bp.branding === filters.branding;
      
      return matchesSearch && matchesBranding;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
      return 0;
    });

  return {
    history,
    setHistory,
    historyLoading,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    filteredHistory,
    fetchHistory,
    deleteHistory,
    duplicateBlueprint,
    refreshHistory
  };
};
