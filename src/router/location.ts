import { ReactLocation, type MakeGenerics } from "react-location";

export type LocationGenerics = MakeGenerics<{
  Search: {
    redirect?: string;
    token?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    searchField?: string;
    sort?: string;
    id?: string;
  };
  Params: {
    id?: string;
  };
  RouteMeta: {
    layout?: "App" | "Auth";
  };
}>;

const location = new ReactLocation();

export default location;
