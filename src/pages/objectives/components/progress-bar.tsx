

export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = "" }) => (
  <div className={`bg-gray-700 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);