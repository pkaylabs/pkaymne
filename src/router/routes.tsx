import { Outlet, type Route, type SearchPredicate } from "react-location";
import type { LocationGenerics } from "./location";
import { lazy } from "react";
const DashboardPage = lazy(() => import("@/pages/dashboard"));
import {
  INDICATORS,
  OBJECTIVES,
  REPORTS,
  SETTINGS,
} from "@/constants/page-path";
const ReportsPage = lazy(() => import("@/pages/reports"));
const ObjectivesPage = lazy(() => import("@/pages/objectives"));
const IndicatorPage = lazy(() => import("@/pages/indicators"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const LandingPage = lazy(() => import("@/pages/landingPage"));

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: "landing-page",
    element: <LandingPage />,
    meta: {
      layout: "Landing",
    },
  },
  {
    path: "/",
    element: <DashboardPage />,
    meta: {
      layout: "App",
    },
  },
  {
    path: OBJECTIVES,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: <ObjectivesPage />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
  {
    path: INDICATORS,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: <IndicatorPage />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
  {
    path: REPORTS,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: <ReportsPage />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
  {
    path: SETTINGS,
    element: <Outlet />,
    meta: {
      layout: "App",
    },
    children: [
      {
        path: "/",
        element: <SettingsPage />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
];

export default routes;
