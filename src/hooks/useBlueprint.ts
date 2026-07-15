import React, { useState } from 'react';
import { Blueprint } from '../types';
import { apiService } from '../services/apiService';
import { firestoreService } from '../services/firestoreService';
import { AgentService } from '../services/AgentService';

export const useBlueprint = (setHistory: React.Dispatch<React.SetStateAction<Blueprint[]>>) => {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isFindingFunding, setIsFindingFunding] = useState(false);

  const generateBlueprint = async (idea: string, branding: string, complexity: string) => {
    if (!idea.trim()) return;
    setLoading(true);
    AgentService.resetAll();
    
    const steps = [
      { id: 'va', task: 'Orchestrating Agent Network...', label: 'Orchestrating Agent Network...' },
      { id: 'mi', task: 'Researching Market Dynamics...', label: 'Researching Market Dynamics...' },
      { id: 'ci', task: 'Analyzing Customer Archetypes...', label: 'Analyzing Customer Archetypes...' },
      { id: 'tech', task: 'Synthesizing Technical Stack...', label: 'Synthesizing Technical Stack...' },
      { id: 'fin', task: 'Building Financial Projections...', label: 'Building Financial Projections...' },
      { id: 'mark', task: 'Generating GTM Strategy...', label: 'Generating GTM Strategy...' },
      { id: 'va', task: 'Finalizing Venture Blueprint...', label: 'Finalizing Venture Blueprint...' }
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      const step = steps[currentStep];
      setLoadingStep(step.label);
      
      // Update agent live status
      AgentService.updateAgent(step.id, { 
        status: 'running', 
        currentTask: step.task,
        duration: 'active'
      });
      
      // Complete previous agent
      if (currentStep > 0) {
        const prevStep = steps[currentStep - 1];
        if (prevStep.id !== step.id) {
          AgentService.updateAgent(prevStep.id, { 
            status: 'completed', 
            currentTask: 'Task Finished',
            lastTask: prevStep.task,
            duration: '2.4s'
          });
        }
      }

      currentStep = (currentStep + 1) % steps.length;
    }, 2500);

    try {
      const newBlueprint = await apiService.generateBlueprint(idea, branding, complexity);
      clearInterval(interval);
      setLoadingStep('Saving to Secure Database...');
      
      // Mark all as completed
      AgentService.getAgents().forEach(a => {
        AgentService.updateAgent(a.id, { 
          status: 'completed', 
          currentTask: 'Idle',
          lastTask: 'Generation Complete',
          duration: a.avgResponseTime
        });
      });
      
      try {
        const id = await firestoreService.saveBlueprint(newBlueprint);
        const savedBlueprint = { ...newBlueprint, id };
        setBlueprint(savedBlueprint);
        setHistory(prev => [savedBlueprint, ...prev]);
        return savedBlueprint;
      } catch (firestoreError) {
        return newBlueprint;
      }
    } catch (error: any) {
      clearInterval(interval);
      AgentService.getAgents().forEach(a => {
        if (a.status === 'running') AgentService.updateAgent(a.id, { status: 'failed', currentTask: 'Error encountered' });
      });
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
