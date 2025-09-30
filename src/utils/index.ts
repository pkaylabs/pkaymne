import { Indicator } from "@/types";
import { 
  Plus, 
  Search, 

  Edit, 
  Trash2, 
  X, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,

  Activity,

  Minus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export { default as classNames } from "./classnames";
export { default as wrapClick } from "./wrap-click";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-900 text-green-300 border-green-700";
    case "Completed":
      return "bg-blue-900 text-blue-300 border-blue-700";
    case "Pending":
      return "bg-yellow-900 text-yellow-300 border-yellow-700";
    case "On Hold":
      return "bg-red-900 text-red-300 border-red-700";
    default:
      return "bg-gray-900 text-gray-300 border-gray-700";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-400";
    case "Medium":
      return "text-yellow-400";
    case "Low":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};


export const calculateStatus = (baseline: number, target: number, actual: number): Indicator['status'] => {
    if (target === baseline) return 'On Track';
    
    const progress = ((actual - baseline) / (target - baseline)) * 100;
    
    if (progress >= 100) return 'Achieved';
    if (progress >= 80) return 'On Track';
    if (progress >= 50) return 'At Risk';
    return 'Off Track';
  };