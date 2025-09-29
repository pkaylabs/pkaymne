

export const ChartCard: React.FC<{
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