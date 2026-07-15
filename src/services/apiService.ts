import axios from 'axios';
import { Blueprint } from '../types';

const api = axios.create({
  baseURL: window.location.origin,
  timeout: 300000 
});

export const apiService = {
  async generateBlueprint(idea: string, branding: string, complexity: string): Promise<Blueprint> {
    const response = await api.post('/api/chat', { idea, branding, complexity });
    return response.data;
  },

  async generatePitchDeck(blueprint: Blueprint): Promise<any> {
    const response = await api.post('/api/deck', { blueprint });
    return response.data;
  },

  async findFunding(blueprint: Blueprint): Promise<any> {
    const response = await api.post('/api/funding', { blueprint });
    return response.data;
  }
};
