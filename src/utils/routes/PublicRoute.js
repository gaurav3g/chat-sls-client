import React, { useContext } from "react";
import { useImmer } from "use-immer";
import { Route, Redirect, useLocation } from "react-router-dom";
import { RootContext } from "./../../store/Provider";

export default function PublicRoute({ component: Component, ...props }) {
  const queryParam = new URLSearchParams(useLocation().search);
  console.log(queryParam.get("redirect"));
  const { authenticated } = props;
  const context = useContext(RootContext);

  return (
    <Route
      {...props}
      render={(renderProps) =>
        !queryParam.get("redirect") || queryParam.get("redirect") === "" ? (
          <Component {...props} {...renderProps} />
        ) : (
          <Redirect {...props} to={`${queryParam.get("redirect")}`} />
        )
      }
    />
  );
}
