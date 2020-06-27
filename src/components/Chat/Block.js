import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "./../../theme/index";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme = theme) => ({
  root: {
    display: "flex",
    // flexDirection: "column",
    padding: theme.spacing(1),
  },
  block: {
    maxWidth: "85%",
    padding: theme.spacing(1, 1.5),
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(1),
    color: theme.palette.primary.contrastText,
  },
  sender: {
    fontWeight: 600,
  },
}));

export default function Block(props) {
  const { sender } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.block}>
        <Typography
          variant="body1"
          className={classes.sender}
          color="secondary"
          gutterBottom
        >
          {sender}
        </Typography>
        <Typography variant="body1">{props.children}</Typography>
      </div>
    </div>
  );
}
