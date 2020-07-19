import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar } from "@material-ui/core";
import moment from "moment";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // flexDirection: "column",
    padding: theme.spacing(0.5, 1),
  },
  rootSelf: {
    flexDirection: "row-reverse",
  },
  shell: {
    maxWidth: "85%",
    minWidth: "15%",
    display: "flex",
  },
  shellSelf: {
    flexDirection: "row-reverse",
  },
  block: {},
  head: {
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.spacing(0.25),
    borderRadius: theme.spacing(2.5),
    color: theme.palette.primary.contrastText,
  },
  headSelf: {
    borderTopLeftRadius: theme.spacing(2.5),
    borderTopRightRadius: theme.spacing(0.25),
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
  avatarSelf: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(1),
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
  const { sender, createdAt, id, self } = props;
  const classes = useStyles({
    color:
      (sender?.username.charCodeAt(0) +
        sender?.username.charCodeAt(sender?.username.length - 1)) %
      10,
  });

  const timeStr = moment.unix(createdAt).format("hh:mm");

  return (
    <div className={clsx(classes.root, self && classes.rootSelf)} id={id}>
      <div className={clsx(classes.shell, self && classes.shellSelf)}>
        <Avatar className={clsx(classes.avatar, self && classes.avatarSelf)}>
          <Typography variant="body1">{sender?.username.charAt(0)}</Typography>
        </Avatar>
        <div className={classes.block}>
          <div className={clsx(classes.head, self && classes.headSelf)}>
            <Typography variant="body2" className={classes.sender}>
              {sender?.username}
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
