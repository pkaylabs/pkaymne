import React, { FC, Fragment } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  if: boolean | number | string | null | undefined;
};

const Show: FC<Props> = ({ children, if: condition }) => {
  return condition ? <Fragment>{children}</Fragment> : null;
};

export default Show;
