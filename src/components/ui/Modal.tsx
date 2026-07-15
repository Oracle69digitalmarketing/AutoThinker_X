import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'info';
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'info',
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                {variant === 'danger' && (
                  <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                    <AlertTriangle size={24} />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                  {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
                </div>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="mb-8">
              {children}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-700 hover:text-white transition-all"
              >
                {cancelLabel}
              </button>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm shadow-xl transition-all disabled:opacity-50 ${
                    variant === 'danger'
                      ? 'bg-red-600 text-white shadow-red-600/20 hover:bg-red-700'
                      : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? 'Processing...' : confirmLabel}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
