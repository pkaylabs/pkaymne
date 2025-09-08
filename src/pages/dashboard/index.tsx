import React, { useState } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Users,
  CreditCard,
  DollarSign,
  Wallet,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react";

// Types
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  subtitle?: string;
}

interface CustomerOrder {
  id: number;
  name: string;
  address: string;
  date: string;
  status: "Delivered" | "Processed" | "Cancelled";
  price: string;
  avatar: string;
}

interface ChartData {
  month: string;
  value1: number;
  value2: number;
}

interface DonutData {
  label: string;
  value: number;
  color: string;
}

// MetricCard Component
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  subtitle,
}) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 hover:scale-105 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-300 text-sm font-medium">{title}</span>
      <div className="text-gray-300 hover:text-gray-400 transition-colors">
        {icon}
      </div>
    </div>
    <div className="space-y-2">
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
      {change && (
        <div
          className={`flex items-center text-sm ${
            changeType === "positive" ? "text-green-400" : "text-red-400"
          }`}
        >
          {changeType === "positive" ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change} since last month
        </div>
      )}
    </div>
  </div>
);

// Interactive Donut Chart Component
const InteractiveDonutChart: React.FC<{
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

// Interactive Bar Chart Component
const InteractiveBarChart: React.FC = () => {
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
        <span>400k</span>
        <span>300k</span>
        <span>200k</span>
        <span>100k</span>
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
            {hoveredBar.type}: {hoveredBar.value}k
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400 text-xs">Primary Sales</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400 text-xs">Secondary Sales</span>
        </div>
      </div>
    </div>
  );
};

// Smooth Interactive Line Chart Component
const InteractiveLineChart: React.FC = () => {
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

// Chart Container Component
const ChartCard: React.FC<{
  title: string;
  year: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, year, children, className = "" }) => (
  <div
    className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <select className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
        <option>{year}</option>
        <option>2022</option>
        <option>2020</option>
        <option>2019</option>
      </select>
    </div>
    {children}
  </div>
);

// Circular Progress Component
const CircularProgress: React.FC<{ percentage: number; color: string }> = ({
  percentage,
  color,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold`} style={{ color }}>
          +{percentage}%
        </span>
      </div>
    </div>
  );
};

// Customer Order Table Component
const CustomerOrderTable: React.FC<{ orders: CustomerOrder[] }> = ({
  orders,
}) => {
  const [sortField, setSortField] = useState<keyof CustomerOrder | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof CustomerOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-900 text-green-300 border-green-700";
      case "Processed":
        return "bg-blue-900 text-blue-300 border-blue-700";
      case "Cancelled":
        return "bg-red-900 text-red-300 border-red-700";
      default:
        return "bg-gray-900 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h3 className="text-white font-semibold text-lg">Customer order</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr className="text-gray-400 text-sm text-nowrap">
              <th
                className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("name")}
              >
                Profile{" "}
                {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("address")}
              >
                Address{" "}
                {sortField === "address" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("date")}
              >
                Date{" "}
                {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortField === "status" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors cursor-pointer text-nowrap"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:scale-110 transition-transform">
                      {order.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{order.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">{order.address}</td>
                <td className="p-4 text-gray-300">{order.date}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-white font-medium">{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const customerOrders: CustomerOrder[] = [
    {
      id: 1,
      name: "Press",
      address: "London",
      date: "22.08.2022",
      status: "Delivered",
      price: "$920",
      avatar: "P",
    },
    {
      id: 2,
      name: "Marina",
      address: "Man city",
      date: "24.08.2022",
      status: "Processed",
      price: "$452",
      avatar: "M",
    },
    {
      id: 3,
      name: "Alex",
      address: "Unknown",
      date: "18.08.2022",
      status: "Cancelled",
      price: "$1200",
      avatar: "A",
    },
    {
      id: 4,
      name: "Robert",
      address: "New York",
      date: "03.08.2022",
      status: "Delivered",
      price: "$1235",
      avatar: "R",
    },
  ];

  const userTypeData: DonutData[] = [
    { label: "New", value: 65, color: "#ffbc11" },
    { label: "Returning", value: 25, color: "#FFE580" },
    { label: "Inactive", value: 10, color: "#FFFBEF" },
  ];

  const subscriptionData: DonutData[] = [
    { label: "Paid", value: 70, color: "#3b82f6" },
    { label: "Trial", value: 30, color: "#93c5fd" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Indicators"
            value="201"
            change="8.2%"
            changeType="positive"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <MetricCard
            title="Development Outcomes"
            value="36"
            change="3.4%"
            changeType="positive"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricCard
            title="Users"
            value="4890"
            change=""
            changeType="positive"
            subtitle="since last month"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Subscriptions"
            value="11"
            change=""
            changeType="positive"
            subtitle="since last year"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>

        {/* Second Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Month total"
            value="25410"
            change="0.2%"
            changeType="negative"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Revenue"
            value="1352"
            change="1.2%"
            changeType="negative"
            icon={<Wallet className="w-5 h-5" />}
          />

          {/* Interactive User Type Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">Users</span>
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <InteractiveDonutChart data={userTypeData} />
              <div className="space-y-2">
                {userTypeData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 hover:bg-gray-700 p-1 rounded transition-colors cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-400 text-xs">
                      {item.value}% {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Subscriptions Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">
                Subscriptions
              </span>
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <InteractiveDonutChart data={subscriptionData} />
              <div className="space-y-2">
                {subscriptionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 hover:bg-gray-700 p-1 rounded transition-colors cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-400 text-xs">
                      {item.value}% {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Sales dynamics" year="2021">
            <InteractiveBarChart />
          </ChartCard>

          <ChartCard title="Overall User Activity" year="2021">
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>400k</span>
                <span>300k</span>
                <span>200k</span>
                <span>0</span>
              </div>
              <InteractiveLineChart />
            </div>
          </ChartCard>
        </div>

        {/* Bottom Row - Financial Cards and Interactive Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Paid Invoices */}
          <div className="flex flex-col justify-between">
            <div className="bg-gray-800 rounded-xl p-6 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CircularProgress percentage={15} color="#8b5cf6" />
                  </div>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Paid Invoices
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $30256.23
              </div>
              <div className="text-gray-400 text-sm">
                Current Financial Year
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CircularProgress percentage={15} color="#8b5cf6" />
                  </div>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Paid Invoices
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $30256.23
              </div>
              <div className="text-gray-400 text-sm">
                Current Financial Year
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            {/* Funds Received */}
            <div className="bg-gray-800 rounded-xl p-6 py-2 mb-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CircularProgress percentage={59} color="#10b981" />
                  </div>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Funds received
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $150256.23
              </div>
              <div className="text-gray-400 text-sm">
                Current Financial Year
              </div>
            </div>
            {/* Funds Received */}
            <div className="bg-gray-800 rounded-xl p-6 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <CircularProgress percentage={59} color="#10b981" />
                  </div>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Funds received
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $150256.23
              </div>
              <div className="text-gray-400 text-sm">
                Current Financial Year
              </div>
            </div>
          </div>

          {/* Interactive Customer Orders Table - Full width on smaller screens */}
          <div className="lg:col-span-2">
            <CustomerOrderTable orders={customerOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
