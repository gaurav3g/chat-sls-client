import React, { useState, useEffect } from "react";
// import { RootContext } from "./../store/Provider";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SendIcon from "@material-ui/icons/Send";
import Block from "../components/Chat/Block";

// import { theme } from "./../theme";
import segregator from "../helpers/chat/segregator";

// hooks
import { usePrevious } from "../hooks/hooks";
import Loader from "../components/Chat/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    maxHeight: "100vh",
    backgroundColor: theme.palette.primary.dark,
  },
  header: {
    flexGrow: 1,
    // marginBottom: 10,
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
    margin: theme.spacing(0.5),
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
    marginTop: theme.spacing(0.5),
  },
  dateBadge: {
    display: "flex",
    padding: theme.spacing(0.5, 1),
    justifyContent: "center",
    "& > *": {
      borderRadius: 40,
      backgroundColor: theme.palette.primary.main,
      opacity: 0.8,
      padding: theme.spacing(0.25, 1, 0),
      color: theme.palette.secondary.contrastText,
    },
  },
}));

export default function ChatLayout(props) {
  const {
    title,
    submitHandler,
    loadmoreHandler,
    appendAtEnd,
    messages,
    noMore,
  } = props;

  // init variables
  // const context = useContext(RootContext);
  const classes = useStyles();
  const [height, setHeight] = useState(0);
  const [message, setMessage] = useState("");
  const [chatWindow, setChatWindow] = useState(null);
  // const [messagesEnd, setMessagesEnd] = useState(null);
  const [segregatedList, setSegregatedList] = useState({});

  const prevList = usePrevious(messages);
  const prevHeight = usePrevious(height);

  // functions
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // context.dispatch({
    //   type: "set",
    //   value: { message: message },
    // });
    submitHandler(message);
    // messagesEnd && messagesEnd.scrollIntoView();
    setMessage("");
  };

  const handleLoadmore = (event) => {
    if (loadmoreHandler) loadmoreHandler();
  };

  function handleScroll() {
    if (
      !noMore &&
      chatWindow &&
      messages.length >= 40 &&
      chatWindow.scrollTop < 100
    ) {
      // console.log("Fetch more list items!");
      handleLoadmore();
    }
  }

  // Effects

  useEffect(() => {
    if (messages) setSegregatedList(segregator(messages));

    if (chatWindow && messages.length) {
      if (!prevList.length || appendAtEnd) {
        // scroll down of first time load
        setTimeout(() => {
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 50);
      } else if (
        prevList.length &&
        prevList[0].created_at !== messages[0].created_at
      ) {
        // for every scroll-up load more
        const heightBeforeRender = chatWindow.scrollHeight;
        setTimeout(() => {
          chatWindow.scrollTop = chatWindow.scrollHeight - heightBeforeRender;
        }, 1);
      }
    }
  }, [appendAtEnd, chatWindow, messages, prevList]);

  // useEffect(() => {
  //   if (appendAtEnd && messagesEnd) {
  //     console.log("end scroll");
  //     messagesEnd.scrollIntoView();
  //   }
  // }, [messagesEnd, appendAtEnd, segregatedList]);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setHeight(window.innerHeight);
    };

    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, [appendAtEnd, chatWindow, prevList]);

  useEffect(() => {
    if (
      chatWindow &&
      chatWindow?.scrollTop > chatWindow?.scrollHeight - prevHeight
    ) {
      setTimeout(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 50);
    }
  }, [chatWindow, height, prevHeight]);

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
      <div
        className={classes.chatSection}
        ref={(el) => {
          setChatWindow(el);
        }}
        onScroll={handleScroll}
      >
        {!noMore && <Loader />}
        {messages.length
          ? Object.keys(segregatedList).map((key, index) => (
              <div key={index}>
                {(index > 0 || noMore) && (
                  <div className={classes.dateBadge}>
                    <Typography variant="body2">{key}</Typography>
                  </div>
                )}
                {segregatedList[key].map((message, messageIndex) => (
                  <Block
                    key={messageIndex}
                    id={`msg${message.created_at}`}
                    sender={message.sender}
                    createdAt={message.created_at}
                    self={
                      localStorage.getItem("t2m_userData") &&
                      JSON.parse(localStorage.getItem("t2m_userData"))
                        .preferred_username === message.sender
                        ? true
                        : false
                    }
                  >
                    {message.content}
                  </Block>
                ))}
              </div>
            ))
          : null}
        {/* <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            setMessagesEnd(el);
          }}
        ></div> */}
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
        ></TextField>
        <IconButton
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
          disableRipple
        >
          <SendIcon color="secondary" />
        </IconButton>
      </form>
    </div>
  );
}
