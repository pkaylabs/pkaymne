import { Outlet, type Route, type SearchPredicate } from "react-location";
import type { LocationGenerics } from "./location";
import DashboardPage from "@/pages/dashboard";
import { DASHBOARD, HOME, INDICATORS, OBJECTIVES, PROJECTS, REPORTS, SETTINGS } from "@/constants/page-path";
import ObjectivesPage from "@/pages/objectives";
import IndicatorPage from "@/pages/indicators";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import MarketingPage from "@/pages/marketing";
import ProjectsPage from "@/pages/projects";

export type RouteProps = Omit<Route, "children"> & {
  navigation?: boolean;
  sidebar?: { label: string; icon: any };
  children?: RouteProps[];
  search?: SearchPredicate<LocationGenerics>;
};

const routes: RouteProps[] = [
  {
    path: HOME,
    element: <MarketingPage />,
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
        element: <DashboardPage />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "outcomes",
        element: <ObjectivesPage />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "indicators",
        element: <IndicatorPage />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "reports",
        element: <ReportsPage />,
        meta: {
          layout: "App",
        },
      },
      {
        path: "settings",
        element: <SettingsPage />,
        meta: {
          layout: "App",
        },
      },
    ],
  },
  
];

export default routes;
