import { CustomerOrder, DonutData, Objective } from "@/types";

export const customerOrders: CustomerOrder[] = [
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

export const userTypeData: DonutData[] = [
  { label: "On Track", value: 65, color: "#ffbc11" },
  { label: "At Risk", value: 25, color: "#FFE580" },
  { label: "Delayed", value: 10, color: "#FFFBEF" },
];

export const subscriptionData: DonutData[] = [
  { label: "Complete", value: 70, color: "#3b82f6" },
  { label: "Pending", value: 30, color: "#93c5fd" },
];

export const sampleObjectives: Objective[] = [
  {
    id: 1,
    name: 'An industrialised and diversified economy',
    description: 'Increase industrial satisfaction scores by 20% through improved service delivery',
    numIndicators: 5,
    status: 'Active',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-15',
    dueDate: '2024-06-30',
    progress: 75,
    category: 'Human Resources'
  },
  {
    id: 2,
    name: 'Enhanced citizenry participation in the economy',
    description: 'Decrease average customer support response time to under 2 hours',
    numIndicators: 3,
    status: 'Active',
    priority: 'High',
    assignedTo: 'Mike Chen',
    createdAt: '2024-02-01',
    dueDate: '2024-04-15',
    progress: 45,
    category: 'Policy and Planning'
  },
  {
    id: 3,
    name: 'Competitive private sector',
    description: 'Complete comprehensive training for all customer service representatives',
    numIndicators: 8,
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'Lisa Rodriguez',
    createdAt: '2023-12-10',
    dueDate: '2024-03-01',
    progress: 100,
    category: 'Research'
  },
  // {
  //   id: 4,
  //   name: 'System Integration',
  //   description: 'Integrate new CRM system with existing customer database',
  //   numIndicators: 12,
  //   status: 'Pending',
  //   priority: 'High',
  //   assignedTo: 'David Kim',
  //   createdAt: '2024-02-20',
  //   dueDate: '2024-08-15',
  //   progress: 20,
  //   category: 'Information Technology'
  // },
  // {
  //   id: 5,
  //   name: 'Market Research Analysis',
  //   description: 'Conduct comprehensive market analysis for Q2 strategy planning',
  //   numIndicators: 6,
  //   status: 'On Hold',
  //   priority: 'Medium',
  //   assignedTo: 'Emma Wilson',
  //   createdAt: '2024-01-30',
  //   dueDate: '2024-05-20',
  //   progress: 30,
  //   category: 'Finance'
  // },
  // {
  //   id: 6,
  //   name: 'Revenue Growth Initiative',
  //   description: 'Implement strategies to achieve 25% revenue growth this quarter',
  //   numIndicators: 10,
  //   status: 'Active',
  //   priority: 'High',
  //   assignedTo: 'James Smith',
  //   createdAt: '2024-01-05',
  //   dueDate: '2024-03-31',
  //   progress: 60,
  //   category: 'Procurement'
  // }
];
