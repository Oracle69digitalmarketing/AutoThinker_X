import { AgentStatus } from '../types';

export class AgentService {
  private static agents: AgentStatus[] = [
    { id: 'va', name: 'Venture Architect', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '2.1s', health: 'healthy', queueLength: 0, model: 'Gemini 2.0 Pro', successRate: '99.2%' },
    { id: 'ci', name: 'Customer Intelligence', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.8s', health: 'healthy', queueLength: 0, model: 'Gemini 1.5 Flash', successRate: '98.5%' },
    { id: 'mi', name: 'Market Intelligence', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.5s', health: 'healthy', queueLength: 0, model: 'Gemini 1.5 Flash', successRate: '97.9%' },
    { id: 'comp', name: 'Competitor Intelligence', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.2s', health: 'healthy', queueLength: 0, model: 'Gemini 1.5 Flash', successRate: '99.1%' },
    { id: 'prod', name: 'Product Strategy', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.9s', health: 'healthy', queueLength: 0, model: 'Gemini 2.0 Pro', successRate: '98.8%' },
    { id: 'tech', name: 'Technology Architecture', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.4s', health: 'healthy', queueLength: 0, model: 'Gemini 2.0 Pro', successRate: '99.5%' },
    { id: 'mark', name: 'Marketing Strategy', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '2.3s', health: 'healthy', queueLength: 0, model: 'Gemini 1.5 Flash', successRate: '96.5%' },
    { id: 'fin', name: 'Finance', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.1s', health: 'healthy', queueLength: 0, model: 'Gemini 2.0 Pro', successRate: '99.8%' },
    { id: 'fund', name: 'Funding Intelligence', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '1.6s', health: 'healthy', queueLength: 0, model: 'Gemini 1.5 Flash', successRate: '98.2%' },
    { id: 'exec', name: 'Execution Roadmap', status: 'idle', currentTask: 'Waiting...', duration: '0s', lastTask: 'None', avgResponseTime: '0.9s', health: 'healthy', queueLength: 0, model: 'Gemini 2.0 Pro', successRate: '99.9%' }
  ];

  private static listeners: ((agents: AgentStatus[]) => void)[] = [];

  static subscribe(listener: (agents: AgentStatus[]) => void) {
    this.listeners.push(listener);
    listener([...this.agents]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach(l => l([...this.agents]));
  }

  static updateAgent(id: string, updates: Partial<AgentStatus>) {
    this.agents = this.agents.map(a => a.id === id ? { ...a, ...updates } : a);
    this.notify();
  }

  static resetAll() {
    this.agents = this.agents.map(a => ({
      ...a,
      status: 'idle',
      currentTask: 'Waiting...',
      duration: '0s'
    }));
    this.notify();
  }

  static getAgents() {
    return [...this.agents];
  }
}
