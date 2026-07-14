import React, { useState } from 'react';
import { PitchSlide } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Presentation, Lightbulb, BarChart, Users, DollarSign, Rocket } from 'lucide-react';

interface PitchDeckViewProps {
  slides: PitchSlide[];
}

export const PitchDeckView: React.FC<PitchDeckViewProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('problem')) return <Lightbulb className="text-yellow-400" size={32} />;
    if (t.includes('market')) return <BarChart className="text-blue-400" size={32} />;
    if (t.includes('team')) return <Users className="text-green-400" size={32} />;
    if (t.includes('finance') || t.includes('funding')) return <DollarSign className="text-emerald-400" size={32} />;
    if (t.includes('roadmap') || t.includes('future')) return <Rocket className="text-purple-400" size={32} />;
    return <Presentation className="text-indigo-400" size={32} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Presentation className="text-indigo-400" /> Interactive Pitch Deck
        </h3>
        <div className="text-sm text-gray-500 font-mono">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="aspect-video bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] -ml-32 -mb-32"></div>

            <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              {getIcon(slides[currentSlide].title)}
            </div>
            
            <h4 className="text-3xl font-black text-white mb-6 tracking-tight uppercase">
              {slides[currentSlide].title}
            </h4>
            
            <div className="max-w-2xl text-left space-y-4">
              {Array.isArray(slides[currentSlide].content) ? (
                <ul className="space-y-2">
                  {slides[currentSlide].content.map((item, i) => (
                    <li key={i} className="text-lg text-gray-300 flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xl text-gray-300 leading-relaxed font-light text-center">
                  {slides[currentSlide].content}
                </div>
              )}
            </div>

            <div className="mt-12 text-[10px] text-indigo-400 font-bold uppercase tracking-widest border-t border-slate-800 pt-6 w-full opacity-60">
              Visual Strategy: {slides[currentSlide].visual_suggestion || "Professional data visualization"}
            </div>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-indigo-500' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};
