import React, { useContext } from "react";
import { useImmer } from "use-immer";
import { RootContext } from "./../../store/Provider";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Modal, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    margin: "auto",
    width: "85vw",
    maxWidth: 600,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: theme.spacing(2),
  },
}));

export default function Login(props) {
  const context = useContext(RootContext);
  const classes = useStyles();

  const [newAcc, setNewAcc] = useImmer(true);

  const handleClose = () => {
    context.dispatch({
      type: "set",
      stype: "loginModalOpen",
      value: false,
    });
  };

  return (
    <Modal
      className={classes.modal}
      open={context.state.loginModalOpen}
      onClose={handleClose}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Paper className={classes.paper}>
        {newAcc ? (
          <SignUp setNewAcc={setNewAcc} />
        ) : (
          <SignIn setNewAcc={setNewAcc} />
        )}
      </Paper>
    </Modal>
  );
}
