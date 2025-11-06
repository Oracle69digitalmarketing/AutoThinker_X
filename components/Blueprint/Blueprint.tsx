// components/Blueprint/Blueprint.tsx
import React from 'react';
import { BlueprintCard } from './BlueprintCard';
import { DetailSection } from './DetailSection';
import { SWOTSection } from './SWOTSection';
import IconLayout from '../icons/IconLayout';
import IconCode from '../icons/IconCode';

interface BlueprintProps {
  result: any;
}

export const Blueprint: React.FC<BlueprintProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
        Your Startup Blueprint
      </h2>

      <BlueprintCard title={result.name} pitch={result.pitch} />

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Value Proposition" content={result.valueProposition} />
        <SWOTSection swot={result.swot} />
      </div>

      <DetailSection
        title="Marketing & Funnel Strategy"
        content={
          <>
            <p className="mb-2"><strong>Funnel:</strong> {result.marketing.funnel}</p>
            <p className="mb-2"><strong>Ad Strategy:</strong> {result.marketing.ads}</p>
            <p><strong>Lead Magnet:</strong> {result.marketing.leadMagnet}</p>
          </>
        }
      />

      <div className="text-center mt-10">
        <h4 className="font-semibold text-lg mb-4 text-gray-200">Tools & Exports</h4>
        <div className="flex justify-center gap-4">
          <button className="btn btn-secondary">
            <IconLayout />
            Export Pitch Deck
          </button>
          <button className="btn btn-secondary">
            <IconCode />
            Export MVP Code
          </button>
        </div>
      </div>
    </div>
  );
};