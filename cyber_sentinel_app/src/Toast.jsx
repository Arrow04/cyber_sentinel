import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed bottom-6 right-6 z-[99999]"
        >
          <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
              <AlertCircle size={20} />
            </div>
            <p className="text-white text-sm font-medium flex-1">{message}</p>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
