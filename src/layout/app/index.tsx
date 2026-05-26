import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useLocation } from "react-location";
import logo from "@/assets/images/logo.png";
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { LuStethoscope } from "react-icons/lu";

import {
  DASHBOARD,
  PROJECTS,
  REPORTS,
  INDICATORS,
  OBJECTIVES,
  OPERATIONS,
  SETTINGS,
  USERS,
  SYSTEM,
} from "@/constants/page-path";
import classNames from "@/utils/classnames";

const navigation = [
  { name: "Dashboard", href: DASHBOARD, icon: MdOutlineDashboard },
  { name: "Projects", href: PROJECTS, icon: ClipboardDocumentListIcon },
  { name: "Outcomes", href: OBJECTIVES, icon: UsersIcon },
  { name: "Indicators", href: INDICATORS, icon: FolderIcon },
  { name: "Reports", href: REPORTS, icon: LuStethoscope },
  { name: "Operations", href: OPERATIONS, icon: CreditCardIcon },
  { name: "Users", href: USERS, icon: UserGroupIcon },
];

const systemNavigation = [
  { name: "System", href: SYSTEM, icon: RectangleGroupIcon },
];

const teams = [
  {
    id: 1,
    name: "Settings",
    href: SETTINGS,
    initial: "S",
    current: false,
  },
];

const socials = [
  { id: 1, icon: CiFacebook, href: "#" },
  { id: 2, icon: FaXTwitter, href: "#" },
  { id: 3, icon: FaInstagram, href: "#" },
  { id: 4, icon: AiOutlineYoutube, href: "#" },
  { id: 5, icon: CiLinkedin, href: "#" },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentPath = useLocation().current.pathname;
  const isActive = (href: string) =>
    href === DASHBOARD ? currentPath === DASHBOARD : currentPath.startsWith(href);
  const pageTitle =
    navigation.find((item) =>
      item.href === DASHBOARD ? currentPath === DASHBOARD : currentPath.startsWith(item.href)
    )?.name ?? systemNavigation.find((item) => currentPath.startsWith(item.href))?.name ?? (isActive(SETTINGS) ? "Settings" : "Dashboard");

  const commandItems = [
    { label: "Open billing self-service", href: `${OPERATIONS}/billing`, meta: "Operations" },
    { label: "Review notifications", href: `${OPERATIONS}/notifications`, meta: "Operations" },
    { label: "Search audit log", href: `${OPERATIONS}/audit`, meta: "Operations" },
    { label: "Import indicators from Excel", href: `${OPERATIONS}/imports`, meta: "Data" },
    { label: "Preview workspace roles", href: `${OPERATIONS}/permissions`, meta: "Access" },
    { label: "Manage subscription packages", href: `${SYSTEM}/packages`, meta: "Super User" },
    { label: "View companies", href: `${SYSTEM}/companies`, meta: "Super User" },
  ];

  const notificationItems = [
    { title: "Submission sync delayed", body: "23 tablet submissions are waiting for connectivity.", tone: "warning" },
    { title: "Report export complete", body: "Quarterly WASH report is ready for download.", tone: "success" },
    { title: "Payment captured", body: "Growth plan invoice INV-2026-005 was paid.", tone: "info" },
  ];

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center bg-gray-200">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item, index) => (
                          <li key={index}>
                            <Link
                              to={item.href}
                              className={classNames(
                                isActive(item.href)
                                  ? "bg-primary-50 text-primary font-semibold"
                                  : "text-gray-800 hover:bg-gray-50 hover:text-primary-600 font-medium",
                                "group flex gap-x-3 rounded-xl px-5 py-3 text-sm  leading-6 capitalize"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive(item.href)
                                    ? "text-primary"
                                    : "text-black group-hover:text-primary",
                                  "h-5 w-5 shrink-0"
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                        {systemNavigation.map((item, index) => (
                          <li key={`system-${index}`}>
                            <Link
                              to={item.href}
                              className={classNames(
                                isActive(item.href)
                                  ? "bg-primary-50 text-primary font-semibold"
                                  : "text-gray-800 hover:bg-gray-50 hover:text-primary-600 font-medium",
                                "group flex gap-x-3 rounded-xl px-5 py-3 text-sm leading-6 capitalize"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive(item.href) ? "text-primary" : "text-black group-hover:text-primary",
                                  "h-5 w-5 shrink-0"
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <Link
                              to={team.href}
                              className={classNames(
                                team.current
                                  ? "bg-gray-50 text-primary-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <span
                                className={classNames(
                                  team.current
                                    ? "border-primary-600 text-primary-600"
                                    : "border-gray-200 text-gray-400 group-hover:border-primary-600 group-hover:text-primary-600",
                                  "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                                )}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <Link
                        to={SETTINGS}
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-primary-600"
                        />
                        Settings
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 border-gray-700 border-r px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center bg-gray-200 mt-4 rounded-md">
              <img
                alt="Your Company"
                src={logo}
                className="h-28 w-auto object-contain"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className={classNames(
                            isActive(item.href)
                              ? "bg-gray-200 text-primary "
                              : "text-gray-200 hover:bg-gray-600",
                            "group flex gap-x-3 rounded-lg px-5 py-3 text-sm  leading-6 capitalize"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive(item.href)
                                ? "text-gray-800"
                                : "text-gray-200 group-hover:text-primary",
                              "h-5 w-5 shrink-0"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-4">
                      <div className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Super User</div>
                    </li>
                    {systemNavigation.map((item, index) => (
                      <li key={`system-${index}`}>
                        <Link
                          to={item.href}
                          className={classNames(
                            isActive(item.href)
                              ? "bg-gray-200 text-primary"
                              : "text-gray-200 hover:bg-gray-600",
                            "group flex gap-x-3 rounded-lg px-5 py-3 text-sm leading-6 capitalize"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive(item.href)
                                ? "text-gray-800"
                                : "text-gray-200 group-hover:text-primary",
                              "h-5 w-5 shrink-0"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <Link
                    to={SETTINGS}
                    className={classNames(
                      isActive(SETTINGS)
                        ? "border-blue-500/40 bg-gray-200 text-gray-900"
                        : "border-gray-600 bg-gray-900/35 text-gray-200 hover:bg-gray-700",
                      "group flex items-center gap-3 rounded-lg border p-4 text-sm font-semibold transition"
                    )}
                  >
                    <span
                      className={classNames(
                        isActive(SETTINGS) ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200",
                        "grid h-10 w-10 place-items-center rounded-lg transition"
                      )}
                    >
                      <Cog6ToothIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span>
                      Settings
                      <span className={classNames(isActive(SETTINGS) ? "text-gray-600" : "text-gray-400", "mt-0.5 block text-xs font-normal")}>
                        Workspace controls
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-64 h-screen flex flex-col">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-gray-900 pr-4 sm:gap-x-6 sm:pr-6 lg:pr-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-200 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="font-semibold text-lg text-gray-200 flex-1 flex items-center pl-6">
                {pageTitle}
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  className="hidden items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 xl:flex"
                >
                  <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
                  Search
                  <span className="rounded bg-gray-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">Ctrl K</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="-m-2.5 p-2 bg-primary-100 rounded-full text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-9 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-start">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm leading-none text-left font-semibold text-gray-200"
                      >
                        Mr. Otoo <br />{" "}
                        <span className="font-normal text-xs text-gray-200">
                          Admin
                        </span>
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-200"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          to={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-200 data-[focus]:bg-gray-600 data-[focus]:outline-none"
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="pr-4 flex-1">
            <div className="h-full bg-gray-900">
              <Outlet />
            </div>
          </main>

          <div className="sticky bottom-0 z-40 flex h-12 shrink-0 items-center gap-x-4  bg-gray-900 pr-4 sm:gap-x-6 sm:pr-6 lg:pr-8">
            <div className="w-full flex justify-between items-center pl-4">
              <div className="flex gap-2.5 items-center text-xs text-gray-500">
                <p className="text-gray-400 text-sm">
                  Copyright &copy; {new Date().getFullYear().toString()}{" "}
                  <Link to={"#"}>PKay Software Consultancy</Link>
                </p>
                <Link
                  to={"#"}
                  className="hover:text-gray-400 transition-all duration-150 ease-in-out"
                >
                  Privacy Policy
                </Link>
                <Link
                  to={"#"}
                  className="hover:text-gray-400 transition-all duration-150 ease-in-out"
                >
                  Term and conditions
                </Link>
                <Link
                  to={"#"}
                  className="hover:text-gray-400 transition-all duration-150 ease-in-out"
                >
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                {socials.map((social, index) => (
                  <Link key={index} to={social.href}>
                    <social.icon
                      aria-hidden="true"
                      className="w-5 h-5 hover:text-gray-600 transition-all duration-150 ease-in-out"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {commandOpen && (
        <div onClick={() => setCommandOpen(false)} className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-24">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="border-b border-slate-700 p-4">
              <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4">
                <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400" />
                <input autoFocus className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search projects, reports, users, companies, audit logs..." />
                <button onClick={() => setCommandOpen(false)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white" aria-label="Close command palette">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </label>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {commandItems.map((item) => (
                <Link key={item.label} to={item.href} onClick={() => setCommandOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:bg-slate-800">
                  <span className="font-semibold text-slate-100">{item.label}</span>
                  <span className="text-xs text-slate-500">{item.meta}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {notificationsOpen && (
        <div onClick={() => setNotificationsOpen(false)} className="fixed inset-0 z-[60] bg-black/40">
          <aside onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col border-l border-slate-700 bg-slate-900 text-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-700 p-5">
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="mt-1 text-sm text-slate-400">Operational alerts across the workspace.</p>
              </div>
              <button onClick={() => setNotificationsOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close notifications">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {notificationItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                  <div className="flex items-start gap-3">
                    <span className={classNames(item.tone === "success" ? "bg-emerald-500" : item.tone === "warning" ? "bg-amber-500" : "bg-blue-500", "mt-1 h-2.5 w-2.5 shrink-0 rounded-full")} />
                    <div>
                      <h3 className="font-semibold text-slate-100">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 p-5">
              <Link to={`${OPERATIONS}/notifications`} onClick={() => setNotificationsOpen(false)} className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500">
                Open notification center
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
