import { useState } from "react";


export const InteractiveLineChart: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
  } | null>(null);

  const dataPoints = [
    { x: 5, y: 80, value: 200 },
    { x: 15, y: 60, value: 250 },
    { x: 25, y: 70, value: 220 },
    { x: 35, y: 45, value: 300 },
    { x: 45, y: 55, value: 280 },
    { x: 55, y: 40, value: 320 },
    { x: 65, y: 30, value: 350 },
    { x: 75, y: 20, value: 380 },
    { x: 85, y: 15, value: 400 },
    { x: 95, y: 10, value: 420 },
  ];

  // Create smooth curve using bezier curves
  const createSmoothPath = (points: typeof dataPoints) => {
    if (points.length === 0) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Control points for smooth curve
      const cp1x = current.x + (next.x - current.x) * 0.3;
      const cp1y = current.y;
      const cp2x = next.x - (next.x - current.x) * 0.3;
      const cp2y = next.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const smoothPath = createSmoothPath(dataPoints);

  return (
    <div className="h-32 w-full relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`${smoothPath} L 95 100 L 5 100 Z`}
          fill="url(#areaGradient)"
          className="transition-all duration-300"
        />

        {/* Main line */}
        <path
          d={smoothPath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm transition-all duration-300"
        />

        {/* Interactive points */}
        {dataPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint?.x === point.x ? 3 : 1.5}
              fill="#a855f7"
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer transition-all duration-200 hover:fill-white"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {hoveredPoint?.x === point.x && (
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="animate-ping"
              />
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-gray-700 text-white text-xs px-3 py-2 rounded shadow-lg z-10 pointer-events-none"
          style={{
            left: `${hoveredPoint.x}%`,
            top: `${hoveredPoint.y}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-medium">Activity: {hoveredPoint.value}k</div>
        </div>
      )}
    </div>
  );
};