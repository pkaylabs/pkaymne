import { ChartData } from "@/types";
import { useState } from "react";


export const InteractiveBarChart: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<{
    month: string;
    type: string;
    value: number;
  } | null>(null);

  const data: ChartData[] = [
    { month: "JAN", value1: 180, value2: 120 },
    { month: "FEB", value1: 220, value2: 160 },
    { month: "MAR", value1: 280, value2: 200 },
    { month: "APR", value1: 260, value2: 180 },
    { month: "MAY", value1: 300, value2: 220 },
    { month: "JUN", value1: 250, value2: 190 },
    { month: "JUL", value1: 320, value2: 240 },
    { month: "AUG", value1: 280, value2: 200 },
    { month: "SEP", value1: 350, value2: 260 },
    { month: "OCT", value1: 380, value2: 280 },
    { month: "NOV", value1: 340, value2: 250 },
    { month: "DEC", value1: 400, value2: 300 },
  ];

  const maxValue = Math.max(...data.flatMap((d) => [d.value1, d.value2]));

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between text-gray-400 text-sm">
        <span>400</span>
        <span>300</span>
        <span>200</span>
        <span>100</span>
        <span>0</span>
      </div>
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-1 flex-1 relative"
          >
            <div className="flex items-end space-x-1 h-40">
              <div
                className="bg-blue-500 rounded-t w-3 transition-all duration-300 hover:bg-blue-400 cursor-pointer transform hover:scale-110"
                style={{ height: `${(item.value2 / maxValue) * 100}%` }}
                onMouseEnter={() =>
                  setHoveredBar({
                    month: item.month,
                    type: "Primary",
                    value: item.value2,
                  })
                }
                onMouseLeave={() => setHoveredBar(null)}
              />
              <div
                className="bg-gray-600 rounded-t w-3 transition-all duration-300 hover:bg-gray-500 cursor-pointer transform hover:scale-110"
                style={{ height: `${(item.value1 / maxValue) * 100}%` }}
                onMouseEnter={() =>
                  setHoveredBar({
                    month: item.month,
                    type: "Secondary",
                    value: item.value1,
                  })
                }
                onMouseLeave={() => setHoveredBar(null)}
              />
            </div>
            <span className="text-gray-400 text-xs font-medium">
              {item.month}
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredBar && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded shadow-lg z-10">
          <div className="font-medium">{hoveredBar.month}</div>
          <div>
            {hoveredBar.type}: {hoveredBar.value}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400 text-xs">Planned</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400 text-xs">Actual</span>
        </div>
      </div>
    </div>
  );
};