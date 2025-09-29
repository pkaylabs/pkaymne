export type System = {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
};

export type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  subtitle?: string;
};

export type CustomerOrder = {
  id: number;
  name: string;
  address: string;
  date: string;
  status: "Delivered" | "Processed" | "Cancelled";
  price: string;
  avatar: string;
};

export type ChartData = {
  month: string;
  value1: number;
  value2: number;
};

export type DonutData = {
  label: string;
  value: number;
  color: string;
};

type Status = "Active" | "Completed" | "Pending" | "On Hold";
type Priority = "High" | "Medium" | "Low";

export type ObjectiveFormData = {
  name: string;
  description: string;
  numIndicators: any;
  status: Status;
  priority: Priority;
  assignedTo: string;
  dueDate: string;
  category: string;
};

export type Objective = ObjectiveFormData & {
  id: number;
  createdAt: string;
  progress: number;
};
