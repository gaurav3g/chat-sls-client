import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

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
  link: {
    marginLeft: 10,
    color: "inherit",
    textDecoration: "none",
  },
}));

export default function HomeLayout(props) {
  const { title } = props;
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
              }}
            >
              <List>
                <ListItem>
                  <Link to="/signup">SignUp</Link>
                </ListItem>
                <ListItem>
                  <Link to="/signin">SignIn</Link>
                </ListItem>
              </List>
            </Drawer>
          </Hidden>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Hidden smDown>
            <Link to="/signup" className={classes.link}>
              SignUp
            </Link>
            <Link to="/signin" className={classes.link}>
              SignIn
            </Link>
          </Hidden>
        </Toolbar>
      </AppBar>
      {props.children}
    </>
  );
}
