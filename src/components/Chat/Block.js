import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // flexDirection: "column",
    padding: theme.spacing(0.5, 1),
  },
  shell: {
    maxWidth: "85%",
    minWidth: "15%",
    display: "flex",
  },
  block: {},
  head: {
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.spacing(0.25),
    borderRadius: theme.spacing(2.5),
    color: theme.palette.primary.contrastText,
  },
  sender: {
    fontWeight: 600,
    color: (props) => theme.palette.headingColor[props.color],
  },
  avatar: {
    backgroundColor: (props) => theme.palette.headingColor[props.color],
    marginRight: theme.spacing(1),
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  message: {
    lineHeight: 1.2,
    paddingBottom: "0.3rem",
  },
  time: {
    color: theme.palette.primary.main,
    float: "right",
    fontSize: 12,
  },
}));

export default function Block(props) {
  const { sender, createdAt, id } = props;
  const classes = useStyles({
    color: (sender.charCodeAt(0) + sender.charCodeAt(sender.length - 1)) % 10,
  });

  const timeStr = moment.unix(createdAt).format("hh:mm");

  return (
    <div className={classes.root} id={id}>
      <div className={classes.shell}>
        <Avatar className={classes.avatar}>
          <Typography variant="body1">{sender.charAt(0)}</Typography>
        </Avatar>
        <div className={classes.block}>
          <div className={classes.head}>
            <Typography variant="body2" className={classes.sender}>
              {sender}
            </Typography>
            <Typography variant="body2" className={classes.message}>
              {props.children}
            </Typography>
          </div>
          <Typography variant="caption" className={classes.time}>
            {timeStr}
          </Typography>
        </div>
      </div>
    </div>
  );
}
