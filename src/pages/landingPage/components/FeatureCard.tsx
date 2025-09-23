import { motion } from "framer-motion";

const FeatureCard: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}> = ({ title, subtitle, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 border border-gray-700 rounded-2xl p-6 relative hover:shadow-2xl transition-transform transform-gpu"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <div className="text-white font-semibold">{title}</div>
          <div className="text-gray-400 text-sm mt-1">{subtitle}</div>
        </div>
      </div>
      <motion.div
        initial={{ rotateX: 0 }}
        whileHover={{ rotateX: -6 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};

export default FeatureCard;
