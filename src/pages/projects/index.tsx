import { CalendarDays, ClipboardList, Plus, Search, Users } from "lucide-react";

const projects = [
  {
    name: "Industrial Transformation Programme",
    owner: "Monitoring and Evaluation",
    status: "Active",
    outcomes: 4,
    indicators: 18,
    due: "Dec 31, 2026",
  },
  {
    name: "Youth Employment Acceleration",
    owner: "Policy and Planning",
    status: "Planning",
    outcomes: 3,
    indicators: 12,
    due: "Sep 30, 2026",
  },
  {
    name: "District Service Delivery Review",
    owner: "Research",
    status: "Active",
    outcomes: 5,
    indicators: 24,
    due: "Jun 15, 2026",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-2 text-gray-400">Manage programmes, outcomes, indicators, and collection workstreams.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Active Projects", "12", ClipboardList],
            ["Assigned Teams", "38", Users],
            ["Upcoming Reviews", "7", CalendarDays],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-lg border border-gray-700 bg-gray-800 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{label as string}</p>
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{value as string}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="flex flex-col gap-3 border-b border-gray-700 p-5 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-white">Project Portfolio</h2>
            <label className="relative block w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                placeholder="Search projects"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700 text-left text-sm text-gray-400">
                <tr>
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Outcomes</th>
                  <th className="p-4 font-medium">Indicators</th>
                  <th className="p-4 font-medium">Review Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.name} className="border-b border-gray-700 text-sm last:border-0 hover:bg-gray-700/40">
                    <td className="p-4 font-medium text-white">{project.name}</td>
                    <td className="p-4 text-gray-300">{project.owner}</td>
                    <td className="p-4">
                      <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{project.outcomes}</td>
                    <td className="p-4 text-gray-300">{project.indicators}</td>
                    <td className="p-4 text-gray-300">{project.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
