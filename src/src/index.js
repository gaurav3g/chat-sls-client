import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import amplifyConf from "./config/amplifyConf";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

require("dotenv").config();

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: amplifyConf.cognito.REGION,
    userPoolId: amplifyConf.cognito.USER_POOL_ID,
    identityPoolId: amplifyConf.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: amplifyConf.cognito.APP_CLIENT_ID,
  },
  // API: {
  //   endpoints: [
  //     {
  //       name: "testApiCall",
  //       endpoint: config.apiGateway.URL,
  //       region: config.apiGateway.REGION,
  //     },
  //   ],
  // },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();