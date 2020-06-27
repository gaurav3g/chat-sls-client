import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    position: "fixed",
    width: "100vw",
    zIndex: "99999",
    "& > div": {
      margin: "auto !important",
    },
  },
}));

export default function PageLoader() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color="primary" size={80} style={{ marginLeft: 8 }} />
    </div>
  );
}
