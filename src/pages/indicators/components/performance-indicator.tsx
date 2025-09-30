export const PerformanceIndicator: React.FC<{ 
  baseline: number; 
  target: number; 
  actual: number; 
  unit: string;
}> = ({ baseline, target, actual, unit }) => {
  const calculateProgress = () => {
    if (target === baseline) return 0;
    return ((actual - baseline) / (target - baseline)) * 100;
  };

  const progress = calculateProgress();
  const isImprovement = target > baseline;
  
  let status: 'success' | 'warning' | 'danger' = 'warning';
  if (progress >= 100) status = 'success';
  else if (progress < 50) status = 'danger';

  const getColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Progress</span>
        <span className="text-white font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {actual} / {target} {unit}
      </div>
    </div>
  );
};