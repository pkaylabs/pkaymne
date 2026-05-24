import {
  Activity,
  CheckCircle2,
  Clock,
  Edit3,
  KeyRound,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

type UserRole = "Owner" | "Admin" | "M&E Manager" | "Project Manager" | "Field Supervisor" | "Field Agent" | "Viewer";
type UserStatus = "Active" | "Invited" | "Suspended";

type WorkspaceUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  projects: string[];
  lastActive: string;
};

const initialUsers: WorkspaceUser[] = [
  { id: 1, name: "Kojo Otoo", email: "kojo.otoo@pkaymne.org", role: "Owner", status: "Active", projects: ["All projects"], lastActive: "Today, 09:30" },
  { id: 2, name: "Ama Boateng", email: "ama.boateng@pkaymne.org", role: "M&E Manager", status: "Active", projects: ["Industrial Transformation", "Youth Employment"], lastActive: "Today, 08:10" },
  { id: 3, name: "Daniel Mensah", email: "daniel.mensah@pkaymne.org", role: "Field Supervisor", status: "Active", projects: ["District Service Delivery"], lastActive: "Yesterday, 17:45" },
  { id: 4, name: "Efua Grant", email: "efua.grant@pkaymne.org", role: "Field Agent", status: "Invited", projects: ["Industrial Transformation"], lastActive: "Invite sent May 22" },
  { id: 5, name: "Nana Owusu", email: "nana.owusu@pkaymne.org", role: "Viewer", status: "Suspended", projects: ["Youth Employment"], lastActive: "May 12, 2026" },
];

const roles: UserRole[] = ["Owner", "Admin", "M&E Manager", "Project Manager", "Field Supervisor", "Field Agent", "Viewer"];
const statuses: Array<UserStatus | "All"> = ["All", "Active", "Invited", "Suspended"];
const permissionRows = [
  ["Manage billing", ["Owner"]],
  ["Invite users", ["Owner", "Admin"]],
  ["Create projects", ["Owner", "Admin", "M&E Manager"]],
  ["Publish forms", ["Owner", "Admin", "M&E Manager", "Project Manager"]],
  ["Approve submissions", ["Owner", "Admin", "M&E Manager", "Field Supervisor"]],
  ["Collect field data", ["Field Agent", "Field Supervisor"]],
  ["View reports", ["Owner", "Admin", "M&E Manager", "Project Manager", "Field Supervisor", "Viewer"]],
];

const emptyInvite = {
  name: "",
  email: "",
  role: "Field Agent" as UserRole,
  projects: "Industrial Transformation Programme",
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState(emptyInvite);

  const filteredUsers = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return users.filter((user) => {
      const matchesQuery = !needle || user.name.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle) || user.role.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [query, roleFilter, statusFilter, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === "Active").length,
      invited: users.filter((user) => user.status === "Invited").length,
      admins: users.filter((user) => user.role === "Owner" || user.role === "Admin").length,
    };
  }, [users]);

  const inviteUser = () => {
    if (!invite.name.trim() || !invite.email.trim()) return;
    setUsers((items) => [
      ...items,
      {
        id: Math.max(0, ...items.map((item) => item.id)) + 1,
        name: invite.name,
        email: invite.email,
        role: invite.role,
        status: "Invited",
        projects: [invite.projects],
        lastActive: "Invite pending",
      },
    ]);
    setInvite(emptyInvite);
    setInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="mt-2 text-gray-400">Invite institution staff, assign roles, and control project-level access.</p>
          </div>
          <button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <UserPlus className="h-5 w-5" />
            Invite User
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total users" value={stats.total} icon={<Users className="h-5 w-5 text-blue-300" />} />
          <StatCard label="Active" value={stats.active} icon={<UserCheck className="h-5 w-5 text-emerald-300" />} />
          <StatCard label="Invited" value={stats.invited} icon={<Mail className="h-5 w-5 text-amber-300" />} />
          <StatCard label="Admins" value={stats.admins} icon={<ShieldCheck className="h-5 w-5 text-violet-300" />} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-gray-700 bg-gray-800">
            <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_180px_200px]">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500" placeholder="Search users, email, role" />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as UserStatus | "All")} className="input-dark h-10">
                {statuses.map((status) => <option key={status}>{status === "All" ? "All statuses" : status}</option>)}
              </select>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as UserRole | "All")} className="input-dark h-10">
                <option>All</option>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </div>

            <div className="p-3">
              <table className="w-full table-fixed text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-[31%] px-3 py-3">User</th>
                    <th className="w-[17%] px-3 py-3">Role</th>
                    <th className="w-[13%] px-3 py-3">Status</th>
                    <th className="w-[22%] px-3 py-3">Project access</th>
                    <th className="w-[13%] px-3 py-3">Last active</th>
                    <th className="w-[72px] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="align-top text-gray-300 transition hover:bg-gray-700/35">
                      <td className="px-3 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-200">{initials(user.name)}</div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-200">{user.role}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(user.status)}`}>{user.status}</span>
                      </td>
                      <td className="px-3 py-4">
                        <p className="line-clamp-2 text-gray-300">{user.projects.join(", ")}</p>
                      </td>
                      <td className="px-3 py-4 text-gray-400">{user.lastActive}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-blue-300" aria-label={`Edit ${user.name}`}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setUsers((items) => items.filter((item) => item.id !== user.id))} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-red-300" aria-label={`Remove ${user.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div className="p-10 text-center text-gray-400">No users match your filters.</div>}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
              <div className="flex items-center gap-2 text-white">
                <KeyRound className="h-5 w-5 text-blue-300" />
                <h2 className="text-lg font-semibold">Role permissions</h2>
              </div>
              <div className="mt-5 space-y-3">
                {permissionRows.map(([permission, allowedRoles]) => (
                  <div key={permission as string} className="rounded-lg border border-gray-700 bg-gray-900/45 p-3">
                    <p className="text-sm font-semibold text-white">{permission as string}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-400">{(allowedRoles as string[]).join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
              <div className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-emerald-300" />
                <h2 className="text-lg font-semibold">Recent access activity</h2>
              </div>
              <div className="mt-5 space-y-3 text-sm text-gray-300">
                {["Ama approved 8 submissions", "Daniel published a field form", "Efua invite still pending", "Kojo changed viewer access"].map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg border border-gray-700 bg-gray-900/45 p-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {inviteOpen && (
        <div onClick={() => setInviteOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Invite user</h2>
                  <p className="mt-1 text-sm text-slate-400">Send an invitation and assign initial workspace access.</p>
                </div>
              </div>
              <button onClick={() => setInviteOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close invite user form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Full name</span>
                <input value={invite.name} onChange={(event) => setInvite({ ...invite, name: event.target.value })} className="input-dark h-11" placeholder="Akua Mensah" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
                <input value={invite.email} onChange={(event) => setInvite({ ...invite, email: event.target.value })} className="input-dark h-11" placeholder="akua@institution.org" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Role</span>
                <select value={invite.role} onChange={(event) => setInvite({ ...invite, role: event.target.value as UserRole })} className="input-dark h-11">
                  {roles.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Project access</span>
                <select value={invite.projects} onChange={(event) => setInvite({ ...invite, projects: event.target.value })} className="input-dark h-11">
                  {["Industrial Transformation Programme", "Youth Employment Acceleration", "District Service Delivery Review", "All projects"].map((project) => <option key={project}>{project}</option>)}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <button onClick={() => setInviteOpen(false)} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Cancel</button>
              <button onClick={inviteUser} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function statusClass(status: UserStatus) {
  switch (status) {
    case "Active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
    case "Invited":
      return "border-amber-500/40 bg-amber-500/10 text-amber-200";
    case "Suspended":
      return "border-red-500/40 bg-red-500/10 text-red-200";
  }
}
