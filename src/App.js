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
import decodeJWT from "./helpers/token/decodeJWT";

import { makeStyles } from "@material-ui/core/styles";
import theme from "./theme/index";
import { ThemeProvider } from "@material-ui/styles";
import Axios from "axios";

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

  useEffect(() => {
    if (
      localStorage.getItem("t2m_accessToken") &&
      localStorage.getItem("t2m_refreshToken") &&
      localStorage.getItem("t2m_refreshToken") !== ""
    ) {
      // context.dispatch({
      //   type: "set",
      //   value: {
      //     t2mToken: {
      //       ...context.state.t2mToken,
      //       tempToken: localStorage.getItem("t2m_tempToken"),
      //       accessToken: localStorage.getItem("t2m_accessToken"),
      //       refreshToken: localStorage.getItem("t2m_refreshToken"),
      //     },
      //   },
      // });
      const decodedToken = decodeJWT(localStorage.getItem("t2m_accessToken"));
      if (decodedToken && decodedToken <= new Date().getTime())
        Axios.post(
          `${process.env.REACT_APP_REST_API_URL}/ws-auth`,
          {
            token: localStorage.getItem("t2m_refreshToken"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "t2m-temptoken": localStorage.getItem("t2m_tempToken"),
            },
          }
        )
          .then((response) => {
            context.dispatch({
              type: "set",
              value: {
                t2mToken: {
                  ...context.state.t2mToken,
                  accessToken: localStorage.getItem("t2m_accessToken"),
                  refreshToken: localStorage.getItem("t2m_refreshToken"),
                },
              },
            });
            localStorage.setItem("t2m_accessToken", response.data.accessToken);
            localStorage.setItem(
              "t2m_refreshToken",
              response.data.refreshToken
            );
          })
          .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    async function authenticateFunction() {
      try {
        Auth.currentSession()
          .then((res) => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            Auth.currentUserInfo()
              .then((data) => {
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

  const childProps = {};

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
