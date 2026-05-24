import { lazy, Suspense } from "react";
import type React from "react";
import { Outlet, type Route, type SearchPredicate } from "react-location";
import type { LocationGenerics } from "./location";
import { CONTACT, DASHBOARD, HOME, INDICATORS, OBJECTIVES, PRIVACY, PROJECTS, REPORTS, SETTINGS, USERS } from "@/constants/page-path";

const DashboardPage = lazy(() => import("@/pages/dashboard"));
const ObjectivesPage = lazy(() => import("@/pages/objectives"));
const IndicatorPage = lazy(() => import("@/pages/indicators"));
const ReportsPage = lazy(() => import("@/pages/reports"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const UsersPage = lazy(() => import("@/pages/users"));
const MarketingPage = lazy(() => import("@/pages/marketing"));
const ProjectsPage = lazy(() => import("@/pages/projects"));
const ProjectDetailPage = lazy(() => import("@/pages/projects/detail"));
const ContactPage = lazy(() => import("@/pages/contact"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: HOME,
    element: withPageSuspense(<MarketingPage />),
    meta: {
      layout: "Public",
    },
  },
  {
    path: CONTACT,
    element: withPageSuspense(<ContactPage />),
    meta: {
      layout: "Public",
    },
  },
  {
    path: PRIVACY,
    element: withPageSuspense(<PrivacyPage />),
    meta: {
      layout: "Public",
    },
  },
  {
    path: DASHBOARD,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: withPageSuspense(<DashboardPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "projects/:projectId/:section",
        element: withPageSuspense(<ProjectDetailPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "projects/:projectId",
        element: withPageSuspense(<ProjectDetailPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "projects",
        element: withPageSuspense(<ProjectsPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "outcomes",
        element: withPageSuspense(<ObjectivesPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "indicators",
        element: withPageSuspense(<IndicatorPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "reports",
        element: withPageSuspense(<ReportsPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "users",
        element: withPageSuspense(<UsersPage />),
        meta: {
          layout: "App",
        },
      },
      {
        path: "settings",
        element: withPageSuspense(<SettingsPage />),
        meta: {
          layout: "App",
        },
      },
    ],
  },
  
];

export default routes;

function withPageSuspense(element: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 p-6">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center text-gray-300">Loading page...</div>
        </div>
      }
    >
      {element}
    </Suspense>
  );
}
