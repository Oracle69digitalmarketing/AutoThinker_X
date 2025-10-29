"use client";

import { useState } from "react";
import IconZap from "@/components/icons/IconZap";
import IconLayout from "@/components/icons/IconLayout";
import IconCode from "@/components/icons/IconCode";

// --- Main Page Component ---

export default function Home() {
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

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock success response
    setResult({
      name: "QuantumLeap AI",
      pitch: "An AI-powered platform that helps developers write and debug quantum computing algorithms.",
      valueProposition: "Making quantum computing accessible to the average developer, today.",
      swot: {
        strengths: "First-mover advantage, strong technical team.",
        weaknesses: "High barrier to entry, niche market.",
        opportunities: "Growth in AI and quantum computing sectors.",
        threats: "Competition from major tech giants.",
      },
      marketing: {
        funnel: "Content marketing (blogs, tutorials) -> Webinar -> Free Trial -> Subscription.",
        ads: "Targeted LinkedIn ads for developers and researchers.",
        leadMagnet: "A free e-book: 'The Developer\'s Guide to Quantum Computing'.",
      }
    });

    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          AutoThinker <span className="text-indigo-400">v3.0</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          The Agentic AI Business Builder — Now Powered by NVIDIA + AWS
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-slate-800/60 p-6 rounded-xl shadow-2xl border border-slate-700">
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
            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all"
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

        {result && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Your Startup Blueprint</h2>
            
            {/* Business Name & Pitch */}
            <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
              <h3 className="text-2xl font-semibold text-indigo-400">{result.name}</h3>
              <p className="text-gray-300 mt-2">{result.pitch}</p>
            </div>

            {/* Core Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">Value Proposition</h4>
                <p className="text-gray-300">{result.valueProposition}</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700">
                <h4 className="font-semibold text-lg mb-2 text-gray-200">SWOT Analysis</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><strong>Strengths:</strong> {result.swot.strengths}</li>
                  <li><strong>Weaknesses:</strong> {result.swot.weaknesses}</li>
                  <li><strong>Opportunities:</strong> {result.swot.opportunities}</li>
                  <li><strong>Threats:</strong> {result.swot.threats}</li>
                </ul>
              </div>
            </div>

            {/* Marketing */}
            <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
              <h4 className="font-semibold text-lg mb-2 text-gray-200">Marketing & Funnel Strategy</h4>
              <p className="text-gray-300 mb-2"><strong>Funnel:</strong> {result.marketing.funnel}</p>
              <p className="text-gray-300 mb-2"><strong>Ad Strategy:</strong> {result.marketing.ads}</p>
              <p className="text-gray-300"><strong>Lead Magnet:</strong> {result.marketing.leadMagnet}</p>
            </div>

            {/* Export Options */}
            <div className="text-center">
                <h4 className="font-semibold text-lg mb-4 text-gray-200">Tools & Exports</h4>
                <div className="flex justify-center gap-4">
                    <button className="flex items-center gap-2 bg-slate-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-600 transition-all">
                        <IconLayout />
                        Export Pitch Deck
                    </button>
                    <button className="flex items-center gap-2 bg-slate-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-slate-600 transition-all">
                        <IconCode />
                        Export MVP Code
                    </button>
                </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
