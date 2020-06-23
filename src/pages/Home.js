import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
} from "@material-ui/core";
import Chat from "./Chat";
import generateJWT from "../helpers/generateJWT";

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
    },
    "& .t2m-home-button": {
      textAlign: "left",
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  const [username, setUsername] = useState(
    localStorage.getItem("TALK2ME_TOKEN") || ""
  );

  const handleChange = (event) => {
    const userN = event.target.value;
    setUsername(userN);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = generateJWT({ username: username });
    localStorage.setItem("TALK2ME_TOKEN", token);
  };

  const validateForm = () => {
    return username.length > 0;
  };

  return localStorage.getItem("TALK2ME_TOKEN") &&
    localStorage.getItem("TALK2ME_TOKEN") !== "" ? (
    <Chat />
  ) : (
    <div>
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
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h4" gutterBottom>
              Common Chat Room Rules
            </Typography>
            <Typography variant="body1" gutterBottom>
              We want our chat room friendly place so everyone can easily join
              and meet up with Strangers.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Some Rules we have mentioned which you have to follow.
            </Typography>
            <Typography variant="body2" gutterBottom>
              Money Laundering
            </Typography>
            <Typography variant="body2" gutterBottom>
              Hush Money (Blackmailing)
            </Typography>
            <Typography variant="body2" gutterBottom>
              No Aggressive Talks
            </Typography>
            <Typography variant="body2" gutterBottom>
              Exhibitions and Sales conversation are not allowed
            </Typography>
            <Typography variant="body2" gutterBottom>
              We don't allow to share awful Content ( i.e. Images, Gifs, Videos,
              and URLs, etc )
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            className="t2m-home-formfield t2m-home-input"
            label="Username"
            autoFocus
            autoComplete={false}
            type="text"
            name="input"
            fullWidth
            margin="none"
            variant="outlined"
            value={username}
            onChange={handleChange}
          ></TextField>
          <Button
            className="t2m-home-formfield t2m-home-button"
            disabled={!validateForm()}
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
          >
            Enter to Chat Room
          </Button>
        </form>
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
    </div>
  );
}
