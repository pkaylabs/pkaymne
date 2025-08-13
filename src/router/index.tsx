import { type FC, type PropsWithChildren } from "react";
import { Router } from "react-location";
import location from "./location";
import routes from "./routes";


const RoutesProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Router location={location} routes={routes}>
        {children}
      </Router>
    </div>
  );
};

export default RoutesProvider;
