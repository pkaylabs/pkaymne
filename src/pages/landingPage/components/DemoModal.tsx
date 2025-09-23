import { motion,AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

const DemoModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-gray-900 w-full max-w-3xl rounded-2xl border border-gray-700 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Product demo</div>
                <div className="text-sm text-gray-400">
                  A short tour of PkayMNE
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
            <div className="bg-black/40 h-64 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Play className="w-12 h-12 text-white/90 mb-3" />
                <div className="text-gray-300">Demo video placeholder</div>
                <div className="text-xs text-gray-500 mt-1">
                  It will be replaced with real demo
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal