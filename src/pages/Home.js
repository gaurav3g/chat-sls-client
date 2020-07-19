import React, { useState, useEffect, useContext } from "react";
import { RootContext } from "./../store/Provider";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  SvgIcon,
  List,
  ListItemText,
  ListItem,
  Hidden,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import CloseIcon from "@material-ui/icons/Close";
import Chat from "./Chat";
import HomeLayout from "./../layouts/HomeLayout";
import PageLoader from "./../components/PageLoader";
import generateJWT from "../helpers/token/generateJWT";
import decodeJWT from "../helpers/token/decodeJWT";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Axios from "axios";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: 15,
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& .t2m-home-formfield": {
      marginTop: 15,
      height: 56,
      [theme.breakpoints.up("md")]: {
        maxWidth: "20vw",
        "&:not(first-child)": {
          marginLeft: 15,
        },
      },
    },
    "& .t2m-home-input": {
      textAlign: "right",
      "& input": {
        color: theme.palette.secondary.main,
      },
    },
    "& .t2m-home-button": {
      textAlign: "left",
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  const context = useContext(RootContext);
  const [formData, setFormData] = useState({
    email: {
      value: decodeJWT(localStorage.getItem("TALK2ME_TEMP_TOKEN")).email || "",
      error: false,
      touched: false,
    },
  });
  const [guestAuthenticated, setGuestAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setclient] = useState(null);

  const handleChange = (event) => {
    const userN = event.target.value;
    setFormData({
      email: { error: false, value: userN, touched: false },
    });
  };

  useEffect(() => {
    const user = context.state.user;
    if (
      user.accessToken &&
      user.attributes.email &&
      user.attributes.preferred_username
    ) {
      setGuestAuthenticated(true);
      setFormData({
        email: { error: false, value: user.attributes.email, touched: false },
      });
    } else if (
      decodeJWT(localStorage.getItem("t2m_accessToken")) &&
      decodeJWT(localStorage.getItem("t2m_accessToken")).exp > moment().unix()
    ) {
      setGuestAuthenticated(true);
    }
  }, [context.state.user]);

  useEffect(() => {
    if (guestAuthenticated)
      setclient(
        new W3CWebSocket(
          `${process.env.REACT_APP_WSS_APIURL}?token=${
            context.state.user.authenticated
              ? context.state.user.accessToken
              : localStorage.getItem("t2m_accessToken")
          }${context.state.user.authenticated ? "&auth=1" : ""}`
        )
      );
  }, [guestAuthenticated]);

  useEffect(() => {
    if (client && context && !context.state.wsClient)
      context.dispatch({
        type: "set",
        value: { wsClient: client },
      });
  }, [client, context]);

  // const testSubmit = (event) => {
  //   event.preventDefault();
  //   Axios.post(
  //     `${process.env.REACT_APP_REST_API_URL}/ws-auth`,
  //     {
  //       token:
  //         "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiMWEzZDA0NGQtYzE1MS0xMWVhLTk4YjQtMmYwMzEyMWIyOTNhIiwidG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKbGVIQWlPakUxT1RReU5EQXdOallzSW1saGRDSTZNVFU1TkRJek5qUTJOaXdpZFhObGNtNWhiV1VpT2lKa1pXVndZV3hwTVRFaWZRLmpabWJDa2tqcUhxLWRvS21QNEFGcDZNTWNRWnZSdG5BUEJzTGVzNTdkUFUiLCJ1c2VybmFtZSI6ImRlZXBhbGkxMSJ9.RsMpmnUD55XpO1YebGL1oPQZTh5rqyCIA-U4A89IKLk",
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "t2m-temptoken":
  //           "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlZXBhbGkxMSJ9.iCKxTq7qiIQcjFibrIT582RH2pca2O1i-4v9_DBiExA",
  //       },
  //     }
  //   )
  //     .then((resp) => console.log(resp))
  //     .catch((err) => console.log(err));
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (formData.email.value === "") {
      setFormData({
        email: { ...formData.email, touched: true, error: true },
      });
      setLoading(false);
      return false;
    }
    const token = generateJWT({ email: formData.email.value });
    Axios.get(
      `${process.env.REACT_APP_REST_API_URL}/get-user?email=${formData.email.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          "t2m-temptoken": token,
        },
      }
    )
      .then((resp) => {
        if (resp.data.status !== 0) {
          setFormData({
            email: { ...formData.email, touched: true, error: true },
          });
        } else {
          Axios.put(
            `${process.env.REACT_APP_REST_API_URL}/set-user`,
            { email: formData.email.value },
            {
              headers: {
                "Content-Type": "application/json",
                "t2m-temptoken": token,
              },
            }
          )
            .then((response) => {
              // console.log(response.data);
              localStorage.setItem("t2m_tempToken", token);
              const userObj = {
                email: response.data.email,
                preferred_username: response.data.username,
              };
              localStorage.setItem("t2m_userData", JSON.stringify(userObj));
              // context.dispatch({
              //   type: "set",
              //   value: {
              //     user: {
              //       ...context.state.user,
              //       info: { ...context.state.user.info, ...userObj },
              //     },
              //   },
              // });
              localStorage.setItem(
                "t2m_accessToken",
                response.data.accessToken
              );
              localStorage.setItem(
                "t2m_refreshToken",
                response.data.refreshToken
              );
              setTimeout(() => {
                setGuestAuthenticated(true);
              }, 100);
            })
            .catch((err) => {
              setFormData({
                email: { ...formData.email, touched: true, error: true },
              });
            });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return guestAuthenticated ? (
    <Chat />
  ) : (
    <HomeLayout title="Talk2ME">
      {loading && <PageLoader />}
      <Container>
        <Grid container>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <Typography variant="h4" gutterBottom>
              Meet With Stranger
            </Typography>
            <Typography variant="body1" gutterBottom>
              In our chat services, you will be able to meet some new friends
              around the globe. There are no registration fees for Chatting with
              a stranger in our common chat room. Our Chat room provides you a
              friendly environment to Chat with strangers without knowing each
              other.
            </Typography>
          </Grid>
        </Grid>
        <Hidden smDown>
          <br />
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="h4" gutterBottom>
                Common Chat Room Rules
              </Typography>
              <Typography variant="body1" gutterBottom>
                We want our chat room friendly place so everyone can easily join
                and meet up with Strangers.
              </Typography>
              <Typography variant="h6">
                Some Rules we have mentioned which you have to follow.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText>Money Laundering</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>Money Laundering</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>Hush Money (Blackmailing)</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>No Aggressive Talks</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Exhibitions and Sales conversation are not allowed
                  </ListItemText>
                </ListItem>
              </List>
              <Typography variant="body2" gutterBottom>
                We don't allow to share awful Content ( i.e. Images, Gifs,
                Videos, and URLs, etc )
              </Typography>
            </Grid>
          </Grid>
        </Hidden>
        <br />
        {/* <form onSubmit={testSubmit} className={classes.form}> */}
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            className="t2m-home-formfield t2m-home-input"
            label="Email"
            autoFocus
            type="email"
            name="input"
            fullWidth
            margin="none"
            variant="outlined"
            value={formData.email.value}
            onChange={handleChange}
            color="secondary"
            inputProps={{ autoComplete: "off" }}
            error={formData.email.touched && formData.email.error}
            InputProps={{
              endAdornment: formData.email.touched && formData.email.error && (
                <InputAdornment position="end">
                  <SvgIcon component={CloseIcon} color={"error"} />
                </InputAdornment>
              ),
            }}
          ></TextField>
          <Button
            className="t2m-home-formfield t2m-home-button"
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
          >
            <Typography variant="button">Enter to Chat Room</Typography>
          </Button>
        </form>
        <Hidden mdUp>
          <br />
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="h4" gutterBottom>
                Common Chat Room Rules
              </Typography>
              <Typography variant="body1" gutterBottom>
                We want our chat room friendly place so everyone can easily join
                and meet up with Strangers.
              </Typography>
              <Typography variant="h6">
                Some Rules we have mentioned which you have to follow.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText>Money Laundering</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>Money Laundering</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>Hush Money (Blackmailing)</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>No Aggressive Talks</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    Exhibitions and Sales conversation are not allowed
                  </ListItemText>
                </ListItem>
              </List>
              <Typography variant="body2" gutterBottom>
                We don't allow to share awful Content ( i.e. Images, Gifs,
                Videos, and URLs, etc )
              </Typography>
            </Grid>
          </Grid>
        </Hidden>
        <br />
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h4" gutterBottom>
              Private Chat Room
            </Typography>
            <Typography variant="body1" gutterBottom>
              If you are shy to talk in a common chat room, so you can easily
              send requests to strangers from the common chat room and talk to
              them in private rooms. There is no text limit for sign-in users.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </HomeLayout>
  );
}
