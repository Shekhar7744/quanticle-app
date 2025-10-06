import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExplanationModal = ({ isOpen, onClose, explanation }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1a1c2e] p-6 rounded-lg max-w-lg w-full shadow-lg border border-neonBlue text-white relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={onClose} className="absolute top-2 right-3 text-gray-400 hover:text-red-400">✖</button>
            <h3 className="text-xl font-bold text-neonBlue mb-4">🧠 AI Explanation</h3>
            <div className="whitespace-pre-line text-sm text-gray-300">
              {explanation}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplanationModal;