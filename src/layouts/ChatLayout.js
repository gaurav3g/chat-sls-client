import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  baseLine: {
    display: "flex",
    position: "fixed",
    bottom: 0,
    width: "100%",
    "& > div": {
      width: "100%",
    },
    "& input": {
      flexGrow: 1,
      padding: theme.spacing(1.5, 2),
    },
    "& button": {
      padding: theme.spacing(1, 2),
    },
  },
}));

export default function ChatLayout(props) {
  const { title, submitHandler } = props;
  const classes = useStyles();

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitHandler(message);
    setMessage("");
  };

  return (
    <>
      <AppBar className={classes.root} position="static">
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
      {props.children}
      <form className={classes.baseLine} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          autoFocus
          color="primary"
          value={message}
          onChange={handleChange}
          placeholder={"Enter text here"}
          autoComplete={false}
        ></TextField>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
        >
          <Hidden smDown>Send</Hidden>
          <Hidden mdUp>
            <Icon>send</Icon>
          </Hidden>
        </Button>
      </form>
    </>
  );
}
