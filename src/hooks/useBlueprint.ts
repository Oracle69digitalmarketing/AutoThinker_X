import React, { useState } from 'react';
import { Blueprint } from '../types';
import { apiService } from '../services/apiService';
import { firestoreService } from '../services/firestoreService';

export const useBlueprint = (setHistory: React.Dispatch<React.SetStateAction<Blueprint[]>>) => {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isFindingFunding, setIsFindingFunding] = useState(false);

  const generateBlueprint = async (idea: string, branding: string, complexity: string) => {
    if (!idea.trim()) return;
    setLoading(true);
    const steps = [
      'Orchestrating Agent Network...',
      'Researching Market Dynamics...',
      'Analyzing Customer Archetypes...',
      'Synthesizing Technical Stack...',
      'Building Financial Projections...',
      'Generating GTM Strategy...',
      'Finalizing Venture Blueprint...'
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      setLoadingStep(steps[currentStep]);
      currentStep = (currentStep + 1) % steps.length;
    }, 3000);

    try {
      const newBlueprint = await apiService.generateBlueprint(idea, branding, complexity);
      clearInterval(interval);
      setLoadingStep('Saving to Secure Database...');
      
      try {
        const id = await firestoreService.saveBlueprint(newBlueprint);
        const savedBlueprint = { ...newBlueprint, id };
        setBlueprint(savedBlueprint);
        setHistory(prev => [savedBlueprint, ...prev]);
        return savedBlueprint;
      } catch (firestoreError) {
        // saved but failed to save to history
        return newBlueprint;
      }
    } catch (error: any) {
      clearInterval(interval);
      console.error("Generation failed:", error);
      throw error;
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleGeneratePitchDeck = async () => {
    if (!blueprint || !blueprint.id) return;
    setIsGeneratingDeck(true);
    try {
      const slides = await apiService.generatePitchDeck(blueprint);
      const updatedBlueprint = { ...blueprint, pitch_deck: slides };
      try {
        await firestoreService.updateBlueprint(blueprint.id, { pitch_deck: slides });
      } catch (firestoreError) {
        alert("Warning: Pitch deck generated but failed to save to cloud history.");
      }
      setBlueprint(updatedBlueprint);
      setHistory(prev => prev.map(b => b.id === blueprint.id ? updatedBlueprint : b));
    } catch (error) {
      alert("Failed to create pitch deck.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleFindFunding = async () => {
    if (!blueprint || !blueprint.id) return;
    setIsFindingFunding(true);
    try {
      const opps = await apiService.findFunding(blueprint);
      const updatedBlueprint = { ...blueprint, funding_opportunities: opps };
      try {
        await firestoreService.updateBlueprint(blueprint.id, { funding_opportunities: opps });
      } catch (firestoreError) {
        alert("Warning: Funding opportunities found but failed to save to cloud history.");
      }
      setBlueprint(updatedBlueprint);
      setHistory(prev => prev.map(b => b.id === blueprint.id ? updatedBlueprint : b));
    } catch (error) {
      alert("Failed to find funding opportunities.");
    } finally {
      setIsFindingFunding(false);
    }
  };

  return {
    blueprint,
    setBlueprint,
    loading,
    loadingStep,
    isGeneratingDeck,
    isFindingFunding,
    generateBlueprint,
    handleGeneratePitchDeck,
    handleFindFunding
  };
};
