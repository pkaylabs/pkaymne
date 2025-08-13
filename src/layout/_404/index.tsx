/* eslint-disable react-hooks/rules-of-hooks */

import _ from "lodash";
import { Link, useMatches } from "react-location";

const _404Layout = () => {
  const matches = useMatches();

  const meta = _.last(matches)?.route?.meta;
  if (!meta?.layout) {
    return <p>loading...</p>;
  }
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Go back home
            </Link>
            <Link to={"/"} className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default _404Layout;
