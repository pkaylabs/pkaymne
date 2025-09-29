import { DonutData } from "@/types";
import { useState } from "react";


export const InteractiveDonutChart: React.FC<{
  data: DonutData[];
  centerValue?: string;
}> = ({ data, centerValue }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const radius = hoveredSegment === index ? 37 : 35;
          const circumference = 2 * Math.PI * radius;
          const strokeDasharray = `${
            (percentage / 100) * circumference
          } ${circumference}`;
          const rotation = currentAngle;
          currentAngle += angle;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={hoveredSegment === index ? 10 : 8}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              transform={`rotate(${rotation} 50 50)`}
              className="transition-all duration-300 cursor-pointer hover:opacity-80"
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="#1f2937"
          className="drop-shadow-lg"
        />
      </svg>
      {centerValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {centerValue}
          </span>
        </div>
      )}
      {hoveredSegment !== null && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg">
          {data[hoveredSegment].label}: {data[hoveredSegment].value}%
        </div>
      )}
    </div>
  );
};