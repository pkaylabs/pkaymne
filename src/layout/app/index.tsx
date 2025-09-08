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
  Cog6ToothIcon,
  FolderIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, Outlet, useLocation, useRouter } from "react-location";
import logo from "@/assets/images/logo.png";
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { LuStethoscope } from "react-icons/lu";
import sideImge from "@/assets/images/side.png";

import {
  DASHBOARD,
  REPORTS,
  INDICATORS,
  OBJECTIVES,
  SETTINGS,
} from "@/constants/page-path";
import classNames from "@/utils/classnames";

const navigation = [
  { name: "Dashboard", href: DASHBOARD, icon: MdOutlineDashboard },
  { name: "Outcomes", href: OBJECTIVES, icon: UsersIcon },
  // { name: "Objectives", href: OBJECTIVES, icon: UsersIcon },
  { name: "Indicators", href: INDICATORS, icon: FolderIcon },
  { name: "Reports", href: REPORTS, icon: LuStethoscope },
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

  const currentPath = useLocation().current.pathname;

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
                                currentPath === item.href ||
                                  currentPath.includes(
                                    item.name.split(" ")[0].toLowerCase()
                                  )
                                  ? "bg-primary-50 text-primary font-semibold"
                                  : "text-gray-800 hover:bg-gray-50 hover:text-primary-600 font-medium",
                                "group flex gap-x-3 rounded-xl px-5 py-3 text-sm  leading-6 capitalize"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  currentPath === item.href ||
                                    currentPath.includes(
                                      item.name.split(" ")[0].toLowerCase()
                                    )
                                    ? "text-primary"
                                    : "text-black group-hover:text-primary",
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
                            currentPath === item.href ||
                              currentPath.includes(
                                item.name.split(" ")[0].toLowerCase()
                              )
                              ? "bg-gray-200 text-primary "
                              : "text-gray-200 hover:bg-gray-600",
                            "group flex gap-x-3 rounded-lg px-5 py-3 text-sm  leading-6 capitalize"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              currentPath === item.href ||
                                currentPath.includes(
                                  item.name.split(" ")[0].toLowerCase()
                                )
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
                <li className="border-t border-gray-500 pt-2">
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    <Link
                      to={SETTINGS}
                      className="group -mx-2 flex gap-x-3 rounded-md px-5 py-3 text-sm/6 font-semibold text-gray-200 hover:bg-gray-600 "
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="size-6 shrink-0 text-gray-200 group-hover:text-primary-600"
                      />
                      Settings
                    </Link>
                  </ul>
                </li>
                <div className="mt-auto select-none">
                  <div className="relative bg-gray-200 p-2 rounded-lg h-40 flex justify-end items-center">
                    <div className="absolute -left-10 -top-28 select-none">
                      <img src={sideImge} alt="" className="w-44 h-64" />
                    </div>
                    <div className="flex flex-col items-center gap-2.5 ">
                      <p className="font-semibold text-xs text-center">
                        Need help? <br /> feel free to contact
                      </p>
                      <button className="py-1.5 px-3 bg-blue-500 rounded-full text-xs text-white flex justify-center items-center cursor-pointer">
                        Get support
                      </button>
                    </div>
                  </div>
                </div>
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
                Dashboard
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
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
    </>
  );
}
