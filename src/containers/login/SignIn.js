import React, { useContext } from "react";
import { useImmer } from "use-immer";
import { Auth } from "aws-amplify";
import { RootContext } from "./../../store/Provider";
// components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// helper
import generateJWT from "../../helpers/token/generateJWT";

const useStyles = makeStyles((theme) => ({
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  verticalSpacing: {
    marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(0.5),
  },
  link: {
    padding: 0,
    "& p": {
      margin: 0,
      textTransform: "none",
      textDecoration: "underline",
    },
  },
}));

export default function SignIn(props) {
  const { setNewAcc } = props;
  const classes = useStyles();
  const context = useContext(RootContext);
  const [isLoading, setIsLoading] = useImmer(false);
  const [formData, setFormData] = useImmer({
    value: {
      email: "",
      password: "",
    },
    error: {
      email: false,
      password: false,
    },
    touched: {
      email: false,
      password: false,
    },
  });

  const validateForm = () => {
    return (
      formData.value.email.length > 0 && formData.value.password.length > 0
    );
  };

  const handleChange = (event) => {
    const target = event.target;
    setFormData((draft) => {
      draft.value[target.name] = target.value;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading((draft) => true);

    try {
      Auth.signIn(formData.value.email, formData.value.password).then(
        (data) => {
          context.dispatch({
            type: "set",
            value: {
              user: { ...context.state.user, authenticated: true },
              loginModalOpen: false,
            },
          });
          // const token = generateJWT({
          //   uid: data.username,
          //   email: data.attributes.email,
          //   username: data.attributes.preferred_username,
          // });
          // localStorage.setItem("TALK2ME_TOKEN", token);
          // this.props.setAuthenticated(true);
          // this.props.history.push("/chat");
        }
      );
    } catch (e) {
      alert(e.message);
      setIsLoading((draft) => false);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          autoFocus
          type="email"
          name="email"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.email}
          onChange={handleChange}
        ></TextField>
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.password}
          onChange={handleChange}
        ></TextField>
        <Button
          variant="contained"
          type="submit"
          size="large"
          fullWidth
          color="primary"
          disabled={!validateForm()}
          className={classes.verticalSpacing}
        >
          Signin
        </Button>
      </form>
    );
  };

  return (
    <div>
      {renderForm()}
      <br />
      <Typography align="center" paragraph variant="body1">
        Don't have an account?{" "}
        <Button
          onClick={() => {
            setNewAcc((draft) => true);
          }}
          className={classes.link}
        >
          <Typography align="center" paragraph variant="body1">
            Sign Up
          </Typography>
        </Button>
      </Typography>
    </div>
  );
}
