import { useState, useEffect } from 'react';

export interface Settings {
  startup: {
    defaultBranding: 'tech-bold' | 'corporate-clean' | 'playful-modern';
    defaultComplexity: 'low' | 'medium' | 'high';
  };
  ai: {
    provider: string;
    temperature: number;
    maxTokens: number;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: string;
    animations: boolean;
  };
  export: {
    defaultFormat: string;
    autoZip: boolean;
    filenamePattern: string;
  };
  notifications: {
    success: boolean;
    errors: boolean;
    backgroundTasks: boolean;
  };
}

const defaultSettings: Settings = {
  startup: {
    defaultBranding: 'tech-bold',
    defaultComplexity: 'medium',
  },
  ai: {
    provider: 'groq-llama3-70b',
    temperature: 0.7,
    maxTokens: 4096,
  },
  appearance: {
    theme: 'system',
    accentColor: '#4f46e5',
    animations: true,
  },
  export: {
    defaultFormat: 'pdf',
    autoZip: false,
    filenamePattern: '{name}_{type}_{date}',
  },
  notifications: {
    success: true,
    errors: true,
    backgroundTasks: true,
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};
