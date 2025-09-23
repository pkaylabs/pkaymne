import { Suspense, type FC, type PropsWithChildren } from "react";
import { Router } from "react-location";
import location from "./location";
import routes from "./routes";

const RoutesProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Router location={location} routes={routes}>
        <Suspense
          fallback={
            <div className="min-h-screen grid place-items-center">
              Loading....
            </div>
          }
        >
          {children}
        </Suspense>
      </Router>
    </div>
  );
};

export default RoutesProvider;
