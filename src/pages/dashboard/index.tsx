import React from "react";
import {
  CheckCircle,
  Users,
  CreditCard,
  DollarSign,
  Wallet,
  Activity,
} from "lucide-react";
import { MetricCard } from "./components/metric-card";
import { InteractiveDonutChart } from "./components/donut-chart";
import { customerOrders, subscriptionData, userTypeData } from "@/constants/data";
import { ChartCard } from "./components/chart-card";
import { InteractiveBarChart } from "./components/bar-chart";
import { InteractiveLineChart } from "./components/line-chart";
import { CircularProgress } from "./components/circular-progress";
import { CustomerOrderTable } from "./components/table";


const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Projects"
            value="201"
            change="8.2%"
            changeType="positive"
            icon={<Activity className="w-5 h-5" />}
          />
          <MetricCard
            title="Targets Achieved"
            value="36"
            change="3.4%"
            changeType="positive"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <MetricCard
            title="Beneficiaries"
            value="4.890"
            change=""
            changeType="positive"
            subtitle="since last month"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Data Collection"
            value="1.201"
            change=""
            changeType="positive"
            subtitle="since last year"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>

        {/* Second Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Budget Utilized"
            value="25,410"
            change="0.2%"
            changeType="negative"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            title="Impact Score"
            value="1,352"
            change="1.2%"
            changeType="negative"
            icon={<Wallet className="w-5 h-5" />}
          />

          {/* Interactive User Type Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">
                Project Status
              </span>
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <InteractiveDonutChart data={userTypeData} />
              <div className="space-y-2">
                {userTypeData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-nowrap hover:bg-gray-700 p-1 rounded transition-colors cursor-pointer"
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
                Data Collection Status
              </span>
              <CreditCard className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <InteractiveDonutChart data={subscriptionData} />
              <div className="space-y-2">
                {subscriptionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-nowrap hover:bg-gray-700 p-1 rounded transition-colors cursor-pointer"
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
          <ChartCard title="Project Implementation Progress" year="2021">
            <InteractiveBarChart />
          </ChartCard>

          <ChartCard title="Outcome Indicators Trend" year="2021">
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
                $ 30,256.23
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
                Sent Invoices
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $ 30,256.23
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
                Project Funds
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                $ 10,256.23
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
                $ 150,256.23
              </div>
              <div className="text-gray-400 text-sm">
                Current Financial Year
              </div>
            </div>
          </div>

          {/* Interactive Customer Orders Table */}
          <div className="lg:col-span-2">
            <CustomerOrderTable orders={customerOrders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
