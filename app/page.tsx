"use client";

import { useState } from "react";
import IconZap from "@/components/icons/IconZap";
import { Blueprint } from "@/components/Blueprint/Blueprint";
import { mockData } from "./mock-data";

// --- Header Component ---

const Header = () => (
  <header className="text-center mb-12">
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
      AutoThinker <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">v3.1</span>
    </h1>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
      The Agentic AI Business Builder — Now Powered by NVIDIA + AWS
    </p>
  </header>
);

// --- Form Component ---

interface FormProps {
  idea: string;
  setIdea: (idea: string) => void;
  loading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

const IdeaForm: React.FC<FormProps> = ({ idea, setIdea, loading, error, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="card-base p-6">
    <label htmlFor="business-idea" className="block text-lg font-medium text-gray-200 mb-2">
      Enter Your Business Idea
    </label>
    <textarea
      id="business-idea"
      rows={4}
      className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-200"
      placeholder="e.g., A platform that uses AI to create personalized travel itineraries..."
      value={idea}
      onChange={(e) => setIdea(e.target.value)}
    />
    {error && <p className="text-red-400 mt-2">{error}</p>}
    <button
      type="submit"
      disabled={loading}
      className="btn btn-primary mt-4 w-full"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Generating...
        </>
      ) : (
        <>
          <IconZap />
          Generate Blueprint
        </>
      )}
    </button>
  </form>
);

// --- Main Page Component ---

const MainPage = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError("Please enter a business idea.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setResult(mockData);
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <Header />
      <div className="max-w-3xl mx-auto">
        <IdeaForm
          idea={idea}
          setIdea={setIdea}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
        />
        <Blueprint result={result} />
      </div>
    </main>
  );
};

export default MainPage;