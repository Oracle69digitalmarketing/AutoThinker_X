import { useState, useEffect } from 'react';
import { AgentService } from '../services/AgentService';
import { AgentStatus } from '../types';

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(AgentService.getAgents());

  useEffect(() => {
    return AgentService.subscribe(setAgents);
  }, []);

  return { agents };
};
