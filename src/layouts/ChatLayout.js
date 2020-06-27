import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SendIcon from "@material-ui/icons/Send";

import { theme } from "./../theme";

const useStyles = makeStyles((theme = theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    maxHeight: "100vh",
    backgroundColor: theme.palette.primary.light,
  },
  header: {
    flexGrow: 1,
    marginBottom: 10,
    flexShrink: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  baseLine: {
    display: "flex",
    // position: "fixed",
    // bottom: 0,
    margin: 5,
    flexShrink: 0,
    "& > div": {
      width: "100%",
    },
    "& fieldset": {
      borderRadius: 40,
    },
    "& input": {
      flexGrow: 1,
      borderRadius: 40,
      padding: theme.spacing(1.75, 2),
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
    },
    "& button": {
      // padding: theme.spacing(1, 2),
      // borderRadius: 20,
      marginLeft: 5,
      backgroundColor: theme.palette.primary.main,
      "&:focus": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  chatSection: {
    flexGrow: 1,
    height: "100%",
    overflowY: "auto",
  },
}));

export default function ChatLayout(props) {
  const { title, submitHandler } = props;
  const classes = useStyles();
  const [height, setHeight] = useState(0);
  const [message, setMessage] = useState("");
  const [messagesEnd, setMessagesEnd] = useState(null);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitHandler(message);
    setMessage("");
  };

  const updateWindowDimensions = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    messagesEnd && messagesEnd.scrollIntoView();
  });

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  return (
    <div className={classes.root} style={{ height: height }}>
      <AppBar className={classes.header} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.chatSection}>
        {props.children}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            setMessagesEnd(el);
          }}
        ></div>
      </div>
      <form className={classes.baseLine} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          autoFocus
          color="primary"
          value={message}
          onChange={handleChange}
          placeholder={"Enter text here"}
          inputProps={{ autoComplete: "off" }}
          disableRipple
        ></TextField>
        <IconButton
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
        >
          <SendIcon color="secondary" />
        </IconButton>
      </form>
    </div>
  );
}
