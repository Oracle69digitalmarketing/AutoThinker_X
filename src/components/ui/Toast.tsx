import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.type !== 'loading') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.type, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
    warning: <AlertCircle className="text-amber-500" size={18} />,
    info: <Info className="text-indigo-400" size={18} />,
    loading: <Loader2 className="text-indigo-400 animate-spin" size={18} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto min-w-[300px] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-bold text-white tracking-tight">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
};
