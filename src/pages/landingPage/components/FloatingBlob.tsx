import { motion } from "framer-motion";

const FloatingBlob: React.FC<{ className?: string; delay?: number }> = ({
  className = "",
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      delay,
      duration: 0.8,
      stiffness: 80,
      damping: 12,
    }}
    className={`absolute pointer-events-none ${className}`}
  >
    <svg viewBox="0 0 200 200" className="w-56 h-56 opacity-30 filter blur-2xl">
      <defs>
        <linearGradient id={`g-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5a0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#g-${delay})`}
        d="M45.8,-58.2C60.2,-49.2,73.6,-36.6,77,-23.1C80.4,-9.7,73.9,4.6,67.5,18.7C61.1,32.8,54.9,46.8,43,55.1C31.2,63.3,15.6,65.9,1.2,64.1C-13.2,62.2,-26.4,56.2,-36.5,46.1C-46.6,35.9,-53.8,21.8,-58.2,6.9C-62.7,-8.1,-64.3,-24.9,-57.7,-36.9C-51.1,-48.9,-36.4,-56.1,-21.7,-62.1C-6.9,-68.1,7.9,-72.9,23.9,-72.3C39.8,-71.6,56.8,-65.2,45.8,-58.2Z"
        transform="translate(100 100)"
      />
    </svg>
  </motion.div>
);

export default FloatingBlob;
