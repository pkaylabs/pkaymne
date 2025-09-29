import { CustomerOrder } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";


export const CustomerOrderTable: React.FC<{ orders: CustomerOrder[] }> = ({
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
        <h3 className="text-white font-semibold text-lg">
          Recent Project Updates
        </h3>
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