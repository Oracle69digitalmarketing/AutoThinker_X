// components/Blueprint/DetailSection.tsx
import React from 'react';

interface DetailSectionProps {
  title: string;
  content: React.ReactNode;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ title, content }) => (
  <div className="card-base">
    <h4 className="font-semibold text-lg mb-2 text-gray-200">{title}</h4>
    <div className="text-gray-300">{content}</div>
  </div>
);