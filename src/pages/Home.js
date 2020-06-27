import React, { useState, useEffect } from "react";
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

const useStyles = makeStyles((theme = theme) => ({
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
  const [formData, setFormData] = useState({
    username: {
      value:
        decodeJWT(localStorage.getItem("TALK2ME_TEMP_TOKEN")).username || "",
      error: false,
      touched: false,
    },
  });
  const [guestAuthenticated, setGuestAuthenticated] = useState(
    decodeJWT(localStorage.getItem("TALK2ME_TEMP_TOKEN")) ? true : false
  );
  const [loading, setLoading] = useState(false);
  const [client, setclient] = useState(null);

  const handleChange = (event) => {
    const userN = event.target.value;
    setFormData({
      username: { error: false, value: userN, touched: false },
    });
  };

  useEffect(() => {
    if (guestAuthenticated)
      setclient(
        new W3CWebSocket(
          `${process.env.REACT_APP_WSS_APIURL}?token=${localStorage.getItem(
            "TALK2ME_TEMP_TOKEN"
          )}`
        )
      );
  }, [guestAuthenticated]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const token = generateJWT({ username: formData.username.value });
    fetch(
      `${process.env.REACT_APP_REST_API_URL}/get-username?username=${formData.username.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "t2m-temptoken": token,
        },
      }
    )
      .then((resp) => {
        console.log("SUCCESS", resp.status);
        if (resp.status !== 200) {
          setFormData({
            username: { ...formData.username, touched: true, error: true },
          });
        } else {
          setGuestAuthenticated(true);
          localStorage.setItem("TALK2ME_TEMP_TOKEN", token);
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      })
      .finally(() => setLoading(false));
  };

  // const validateForm = () => {
  //   return formData.username.value.length > 0;
  // };

  return guestAuthenticated &&
    ((localStorage.getItem("TALK2ME_TOKEN") &&
      localStorage.getItem("TALK2ME_TOKEN") !== "") ||
      (localStorage.getItem("TALK2ME_TEMP_TOKEN") &&
        localStorage.getItem("TALK2ME_TEMP_TOKEN") !== "")) ? (
    <Chat client={client} />
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
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            className="t2m-home-formfield t2m-home-input"
            label="Username"
            autoFocus
            type="text"
            name="input"
            fullWidth
            margin="none"
            variant="outlined"
            value={formData.username.value}
            onChange={handleChange}
            color="secondary"
            inputProps={{ autoComplete: "off" }}
            error={formData.username.touched && formData.username.error}
            InputProps={{
              endAdornment: formData.username.touched &&
                formData.username.error && (
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
