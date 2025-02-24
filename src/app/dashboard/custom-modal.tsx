import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heading?: string; // Optional heading for the modal
  width?: string; // Optional custom width
  height?: string; // Optional custom height
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  heading,
  width = "90%",
  height = "90vh",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col shadow-lg ${width}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: width, height: height }}
          >
            <div className="flex justify-between items-center mb-4">
              {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-hidden">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
