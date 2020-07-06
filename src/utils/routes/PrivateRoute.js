import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { Route, Redirect } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { authenticated } = rest;
  const [client, setClient] = useImmer(null);

  useEffect(() => {
    if (
      !client &&
      localStorage.getItem("TALK2ME_TOKEN") &&
      localStorage.getItem("TALK2ME_TOKEN") !== ""
    ) {
      setClient(
        new W3CWebSocket(
          `${process.env.REACT_APP_WSS_APIURL}?token=${localStorage.getItem(
            "TALK2ME_TOKEN"
          )}`
        )
      );
    }
  }, [client, setClient]);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} client={client} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
