import { Outlet, type Route, type SearchPredicate } from "react-location";
import type { LocationGenerics } from "./location";
import DashboardPage from "@/pages/dashboard";
import { INDICATORS, OBJECTIVES, REPORTS, SETTINGS } from "@/constants/page-path";
import ObjectivesPage from "@/pages/objectives";
import IndicatorPage from "@/pages/indicators";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
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
