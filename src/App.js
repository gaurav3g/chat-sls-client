import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { Auth } from "aws-amplify";
import jwt from "jwt-simple";

// components
import Home from "./pages/Home";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import NoMatch from "./pages/NoMatch";

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
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
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
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function authenticateFunction() {
      try {
        if (await Auth.currentSession()) {
          setAuthenticated(true);
          Auth.currentUserInfo()
            .then((data) => {
              const token = jwt.encode(
                { username: data.username },
                process.env.REACT_APP_API_SECRET,
                "HS256"
              );
              localStorage.setItem("username", token);
            })
            .catch((err) => console.log(err));
        }
      } catch (e) {
        if (e !== "No current user") {
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
