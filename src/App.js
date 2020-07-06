import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";

import { RootContext } from "./store/Provider";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { Auth } from "aws-amplify";

import PrivateRoute from "./utils/routes/PrivateRoute";
import PublicRoute from "./utils/routes/PublicRoute";
import ProtectedRoute from "./utils/routes/ProtectedRoute";

import { makeStyles } from "@material-ui/core/styles";
import theme from "./theme/index";
import { ThemeProvider } from "@material-ui/styles";

// components
import Home from "./pages/Home";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import NoMatch from "./pages/NoMatch";
import NewConversation from "./pages/NewConversation/NewConversation";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#37474f",
  },
}));

function App(props) {
  const classes = useStyles();
  const context = useContext(RootContext);
  const [authUser, setAuthUser] = useImmer({
    authenticated: false,
    accessToken: "",
    info: {},
  });
  const [client, setClient] = useImmer(null);

  useEffect(() => {
    async function authenticateFunction() {
      try {
        Auth.currentSession()
          .then((res) => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            Auth.currentUserInfo()
              .then((data) => {
                console.log(data);
                setAuthUser((draft) => {
                  draft.accessToken = jwt;
                  draft.authenticated = true;
                  draft.info = data;
                });
                localStorage.removeItem("TALK2ME_TEMP_TOKEN");
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
  }, [setAuthUser, context.state.user]);

  useEffect(() => {
    if (context.state.user.accessToken !== authUser.accessToken)
      context.dispatch({
        type: "set",
        value: { user: authUser },
      });
  }, [authUser, context]);

  // const handleLogout = async (event) => {
  //   await Auth.signOut();
  //   setAuthenticated(false);
  //   props.history.push("/login");
  // };

  const childProps = {
    client,
    setClient,
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Router>
          <Switch>
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
            <PublicRoute
              path="/"
              component={Home}
              {...childProps}
            ></PublicRoute>

            {/* ##### NOT FOUND ##### */}
            <Route component={NoMatch}></Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
