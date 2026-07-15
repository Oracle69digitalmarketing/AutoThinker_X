import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-8 bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">System Interruption</h1>
              <p className="text-slate-400 font-medium">AutoThinker X encountered an unexpected error. Our agents are working to resolve the issue.</p>
            </div>
            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-left">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Error Trace</p>
               <p className="text-xs font-mono text-red-400/80 line-clamp-3">{this.state.error?.message || 'Unknown system failure'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all"
              >
                <RefreshCcw size={18} />
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Home size={18} />
                Recovery
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
