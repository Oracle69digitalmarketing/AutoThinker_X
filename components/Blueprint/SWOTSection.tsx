// components/Blueprint/SWOTSection.tsx
import React from 'react';
import IconChartBar from '../icons/IconChartBar';

interface SWOTSectionProps {
  swot: {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  };
}

export const SWOTSection: React.FC<SWOTSectionProps> = ({ swot }) => (
  <div className="card-base">
    <h4 className="font-semibold text-lg mb-3 text-gray-200 flex items-center gap-2">
      <IconChartBar /> SWOT Analysis
    </h4>
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
      <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">✔</span> <strong>Strengths:</strong> {swot.strengths}</li>
      <li className="flex items-start"><span className="text-red-400 mr-2 mt-1">✖</span> <strong>Weaknesses:</strong> {swot.weaknesses}</li>
      <li className="flex items-start"><span className="text-blue-400 mr-2 mt-1">↗</span> <strong>Opportunities:</strong> {swot.opportunities}</li>
      <li className="flex items-start"><span className="text-yellow-400 mr-2 mt-1">⚠</span> <strong>Threats:</strong> {swot.threats}</li>
    </ul>
  </div>
);