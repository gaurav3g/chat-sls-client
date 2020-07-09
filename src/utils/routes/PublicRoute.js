import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";

export default function PublicRoute({ component: Component, ...props }) {
  const queryParam = new URLSearchParams(useLocation().search);

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
