import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  CalendarDays,
  ClipboardList,
  FolderKanban,
  Edit3,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-location";
import { apiRequest, getDemoToken } from "@/lib/api/client";
import { projectStatusFromApi, projectStatusToApi } from "@/lib/api/mappers";

type ProjectStatus = "Active" | "Planning" | "Paused" | "Completed";
type Project = {
  id: number;
  name: string;
  owner: string;
  status: ProjectStatus;
  outcomes: number;
  indicators: number;
  due: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Industrial Transformation Programme",
    owner: "Monitoring and Evaluation",
    status: "Active",
    outcomes: 4,
    indicators: 18,
    due: "2026-12-31",
  },
  {
    id: 2,
    name: "Youth Employment Acceleration",
    owner: "Policy and Planning",
    status: "Planning",
    outcomes: 3,
    indicators: 12,
    due: "2026-09-30",
  },
  {
    id: 3,
    name: "District Service Delivery Review",
    owner: "Research",
    status: "Active",
    outcomes: 5,
    indicators: 24,
    due: "2026-06-15",
  },
];

const emptyForm: Omit<Project, "id"> = {
  name: "",
  owner: "",
  status: "Planning",
  outcomes: 1,
  indicators: 1,
  due: "",
};

const statuses: Array<ProjectStatus | "All"> = ["All", "Active", "Planning", "Paused", "Completed"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyForm);

  const filteredProjects = useMemo(() => {
    const needle = searchTerm.toLowerCase().trim();
    return projects.filter((project) => {
      const matchesSearch =
        !needle ||
        project.name.toLowerCase().includes(needle) ||
        project.owner.toLowerCase().includes(needle) ||
        project.status.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const active = projects.filter((project) => project.status === "Active").length;
    const teams = new Set(projects.map((project) => project.owner)).size;
    const reviews = projects.filter((project) => project.due).length;
    return { active, teams, reviews };
  }, [projects]);

  useEffect(() => {
    let cancelled = false;
    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);
        const token = await getDemoToken("admin");
        const rows = await apiRequest<Array<{
          id: number;
          name: string;
          status: string;
          department_id: number | null;
          end_date: string | null;
        }>>("/projects", { token });
        const mapped = await Promise.all(
          rows.map(async (project) => {
            const [outcomes, indicators] = await Promise.all([
              apiRequest<unknown[]>(`/projects/${project.id}/outcomes`, { token }),
              apiRequest<unknown[]>(`/projects/${project.id}/indicators`, { token }),
            ]);
            return {
              id: project.id,
              name: project.name,
              owner: project.department_id ? `Department ${project.department_id}` : "Monitoring and Evaluation",
              status: projectStatusFromApi(project.status),
              outcomes: outcomes.length,
              indicators: indicators.length,
              due: project.end_date ?? "",
            };
          }),
        );
        if (!cancelled) setProjects(mapped);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Could not load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      owner: project.owner,
      status: project.status,
      outcomes: project.outcomes,
      indicators: project.indicators,
      due: project.due,
    });
    setModalOpen(true);
  };

  const saveProject = async () => {
    if (!form.name.trim() || !form.owner.trim()) return;
    const token = await getDemoToken("admin");
    if (editingProject) {
      await apiRequest(`/projects/${editingProject.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ name: form.name, status: projectStatusToApi(form.status), end_date: form.due || null }),
      });
      setProjects((items) => items.map((item) => (item.id === editingProject.id ? { ...item, ...form } : item)));
    } else {
      const created = await apiRequest<{ id: number }>("/projects", {
        method: "POST",
        token,
        body: JSON.stringify({ name: form.name, status: projectStatusToApi(form.status), end_date: form.due || null }),
      });
      setProjects((items) => [...items, { id: created.id, ...form, outcomes: 0, indicators: 0 }]);
    }
    setModalOpen(false);
  };

  const deleteProject = async (id: number) => {
    const token = await getDemoToken("admin");
    await apiRequest(`/projects/${id}`, { method: "DELETE", token });
    setProjects((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-2 text-gray-400">Manage programmes, outcomes, indicators, and collection workstreams.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Active Projects", stats.active.toString(), ClipboardList],
            ["Assigned Teams", stats.teams.toString(), Users],
            ["Upcoming Reviews", stats.reviews.toString(), CalendarDays],
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
          <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_320px_220px] lg:items-center">
            <h2 className="text-lg font-semibold text-white">Project Portfolio</h2>
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                placeholder="Search projects, teams, status"
              />
            </label>
            <label className="relative block">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ProjectStatus | "All")}
                className="w-full appearance-none rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            {loading && <div className="p-6 text-sm text-gray-400">Loading project portfolio...</div>}
            {error && <div className="p-6 text-sm text-red-300">{error}</div>}
            <table className="w-full">
              <thead className="border-b border-gray-700 text-left text-sm text-gray-400">
                <tr>
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Outcomes</th>
                  <th className="p-4 font-medium">Indicators</th>
                  <th className="p-4 font-medium">Review Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-700 text-sm last:border-0 hover:bg-gray-700/40">
                    <td className="p-4 font-medium text-white">
                      <Link to={`/dashboard/projects/${project.id}`} className="transition hover:text-blue-300">
                        {project.name}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-300">{project.owner}</td>
                    <td className="p-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{project.outcomes}</td>
                    <td className="p-4 text-gray-300">{project.indicators}</td>
                    <td className="p-4 text-gray-300">{formatDate(project.due)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(project)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-blue-300" aria-label={`Edit ${project.name}`}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteProject(project.id)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-red-300" aria-label={`Delete ${project.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProjects.length === 0 && (
            <div className="p-10 text-center text-gray-400">No projects match your search or filter.</div>
          )}
        </div>
      </div>

      <Dialog open={modalOpen} onClose={setModalOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 bg-slate-900 px-6 py-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                  <FolderKanban className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{editingProject ? "Update project" : "Create project"}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Set the ownership, review date, and expected results structure for this project.
                  </p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close project form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <Field label="Project name" hint="Use the programme or project title stakeholders recognize.">
                <div className="field-shell">
                  <FolderKanban className="h-4 w-4 text-slate-400" />
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="field-input" placeholder="Industrial Transformation Programme" />
                </div>
              </Field>
              <Field label="Owner / Department" hint="The team accountable for implementation tracking.">
                <div className="field-shell">
                  <Users className="h-4 w-4 text-slate-400" />
                  <input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} className="field-input" placeholder="Monitoring and Evaluation" />
                </div>
              </Field>
              <Field label="Status">
                <div className="field-shell">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })} className="field-input appearance-none">
                  {statuses.filter((status) => status !== "All").map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                  </select>
                </div>
              </Field>
              <Field label="Review date">
                <div className="field-shell">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} className="field-input" type="date" />
                </div>
              </Field>
              <Field label="Outcomes" hint="Computed from outcomes assigned to this project.">
                <div className="field-shell field-shell-readonly">
                  <ClipboardList className="h-4 w-4 text-slate-400" />
                  <input value={form.outcomes} className="field-input cursor-not-allowed" type="number" readOnly aria-readonly="true" />
                </div>
              </Field>
              <Field label="Indicators" hint="Computed from indicators attached to project outcomes.">
                <div className="field-shell field-shell-readonly">
                  <BarMiniIcon />
                  <input value={form.indicators} className="field-input cursor-not-allowed" type="number" readOnly aria-readonly="true" />
                </div>
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <p className="hidden text-sm text-slate-400 sm:block">Outcomes and indicators update automatically as you build the project framework.</p>
              <div className="flex shrink-0 gap-3">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                Cancel
              </button>
              <button onClick={saveProject} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500">
                {editingProject ? "Save Changes" : "Create Project"}
              </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function BarMiniIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13V7M8 13V3M13 13V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function statusClass(status: ProjectStatus) {
  switch (status) {
    case "Active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
    case "Planning":
      return "border-blue-500/40 bg-blue-500/10 text-blue-200";
    case "Paused":
      return "border-amber-500/40 bg-amber-500/10 text-amber-200";
    case "Completed":
      return "border-purple-500/40 bg-purple-500/10 text-purple-200";
  }
}

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
