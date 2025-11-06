// components/Blueprint/BlueprintCard.tsx
import React from 'react';
import IconSparkles from '../icons/IconSparkles';

interface BlueprintCardProps {
  title: string;
  pitch: string;
}

export const BlueprintCard: React.FC<BlueprintCardProps> = ({ title, pitch }) => (
  <div className="card-glow mb-6">
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-indigo-400 flex items-center gap-2">
        <IconSparkles /> {title}
      </h3>
      <p className="text-gray-300 mt-2">{pitch}</p>
    </div>
  </div>
);