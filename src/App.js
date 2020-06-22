import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { Auth } from "aws-amplify";
import jwt from "jwt-simple";
import { w3cwebsocket as W3CWebSocket } from "websocket";

// components
import Home from "./pages/Home";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import NoMatch from "./pages/NoMatch";
import NewConversation from "./pages/NewConversation/NewConversation";

export function PublicRoute({ component: Component, ...rest }) {
  const { authenticated } = rest;
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect {...rest} to="/chat" />
        )
      }
    />
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const { authenticated } = rest;
  const [client, setClient] = useState(null);

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
  }, [client]);

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

function App(props) {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("TALK2ME_TOKEN") &&
      localStorage.getItem("TALK2ME_TOKEN") !== ""
      ? true
      : false
  );

  useEffect(() => {
    async function authenticateFunction() {
      try {
        Auth.currentSession()
          .then((res) => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            localStorage.setItem("TALK2ME_ACCESS_TOKEN", jwt);
            setAuthenticated(true);
            Auth.currentUserInfo()
              .then((data) => {
                if (
                  localStorage.getItem("TALK2ME_TOKEN") &&
                  localStorage.getItem("TALK2ME_TOKEN") !== ""
                ) {
                  const userData = jwt.decode(
                    localStorage.getItem("TALK2ME_TOKEN"),
                    process.env.REACT_APP_API_SECRET,
                    true,
                    "HS256"
                  );
                  // console.log(userData, data, userData.uid !== data.username);
                  if (userData.uid !== data.username)
                    localStorage.removeItem("TALK2ME_TOKEN");
                } else {
                  const token = jwt.encode(
                    {
                      uid: data.username,
                      email: data.attributes.email,
                      username: data.attributes.preferred_username,
                    },
                    process.env.REACT_APP_API_SECRET,
                    "HS256"
                  );
                  localStorage.setItem("TALK2ME_TOKEN", token);
                }
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => localStorage.removeItem("TALK2ME_TOKEN"));
      } catch (e) {
        if (e !== "No current user") {
          localStorage.removeItem("TALK2ME_TOKEN");
          alert(e);
        }
      }
    }
    authenticateFunction();
  }, []);

  const handleLogout = async (event) => {
    await Auth.signOut();

    setAuthenticated(false);
    props.history.push("/login");
  };

  const childProps = {
    authenticated,
    setAuthenticated,
  };

  return (
    <Router>
      <Switch>
        {/* ##### HOME ROUTE ##### */}
        <Route exact path="/" component={Home}></Route>
        {/* ##### PRIVATE ROUTE ##### */}
        <PrivateRoute
          path="/chat"
          component={Chat}
          {...childProps}
        ></PrivateRoute>
        <PrivateRoute
          path="/new-conversation"
          component={NewConversation}
          {...childProps}
        ></PrivateRoute>
        {/* <PrivateRoute
          path="/room/:id"
          component={PersonalRoom}
          {...childProps}
        ></PrivateRoute> */}

        {/* ##### PUBLIC ROUTE ##### */}
        <PublicRoute
          path="/signup"
          component={Signup}
          {...childProps}
        ></PublicRoute>
        <PublicRoute
          path="/signin"
          component={Signin}
          {...childProps}
        ></PublicRoute>
        {/* ##### NOT FOUND ##### */}
        <Route component={NoMatch}></Route>
      </Switch>
    </Router>
  );
}

export default App;
