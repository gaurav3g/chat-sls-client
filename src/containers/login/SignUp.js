import React, { useContext } from "react";
import { useImmer } from "use-immer";
import { Auth } from "aws-amplify";
import { RootContext } from "./../../store/Provider";

// components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

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

export default function SignUp(props) {
  const { setNewAcc } = props;
  const classes = useStyles();
  const context = useContext(RootContext);
  const [isLoading, setIsLoading] = useImmer(false);
  const [formData, setFormData] = useImmer({
    value: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      gender: "",
    },
    error: {
      email: false,
      username: false,
      password: false,
      confirmPassword: false,
      confirmationCode: false,
      gender: false,
    },
    touched: {
      email: false,
      username: false,
      password: false,
      confirmPassword: false,
      confirmationCode: false,
      gender: false,
    },
  });
  const [newUser, setNewUser] = useImmer(null);

  const validateForm = () => {
    return (
      formData.value.email.length > 0 &&
      formData.value.password.length > 0 &&
      formData.value.username.length > 0 &&
      formData.value.gender.length > 0 &&
      formData.value.password === formData.value.confirmPassword
    );
  };

  const validateConfirmationForm = () => {
    return formData.value.confirmationCode.length > 0;
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
      const newUser = await Auth.signUp({
        username: formData.value.email,
        password: formData.value.password,
        attributes: {
          gender: formData.value.gender,
          preferred_username: formData.value.username,
        },
      });
      setNewUser((draft) => newUser);
    } catch (e) {
      alert(e.message);
    }

    setIsLoading((draft) => false);
  };

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    setIsLoading((draft) => true);

    try {
      await Auth.confirmSignUp(
        formData.value.email,
        formData.value.confirmationCode
      );
      Auth.signIn(formData.value.email, formData.value.password).then(
        (data) => {
          //   console.log("signup", data);
          context.dispatch({
            type: "set",
            stype: "user",
            value: { authenticated: true },
          }); // localStorage.setItem("TALK2ME_TOKEN", token)
          // props.setAuthenticated(true)
          // props.history.push("/chat")
        }
      );
    } catch (e) {
      alert(e.message);
      setIsLoading((draft) => false);
    }
  };

  const renderConfirmationForm = () => {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <TextField
          label="Confirmation Code"
          autoFocus
          type="tel"
          name="confirmationCode"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.confirmationCode}
          onChange={handleChange}
        ></TextField>
        <Button
          disabled={!validateConfirmationForm()}
          variant="contained"
          type="submit"
          fullWidth
          color="primary"
          className={classes.verticalSpacing}
        >
          Verify
        </Button>
      </form>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          autoFocus
          type="text"
          name="username"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.username}
          onChange={handleChange}
        ></TextField>
        <TextField
          label="Email"
          type="email"
          name="email"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.email}
          onChange={handleChange}
        ></TextField>
        <FormControl
          component="fieldset"
          fullWidth
          className={classes.verticalSpacing}
        >
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={formData.value.gender}
            onChange={handleChange}
            className={classes.flexRow}
          >
            <FormControlLabel
              value="female"
              control={<Radio color="primary" />}
              label="Female"
            />
            <FormControlLabel
              value="male"
              control={<Radio color="primary" />}
              label="Male"
            />
            <FormControlLabel
              value="other"
              control={<Radio color="primary" />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>
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
        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.value.confirmPassword}
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
          Signup
        </Button>
      </form>
    );
  };

  return (
    <div>
      {newUser === null ? renderForm() : renderConfirmationForm()}
      <br />
      <Typography align="center" paragraph variant="body1">
        Already a member?{" "}
        <Button
          onClick={() => {
            setNewAcc((draft) => false);
          }}
          className={classes.link}
        >
          <Typography align="center" paragraph variant="body1">
            Sign In
          </Typography>
        </Button>
      </Typography>
    </div>
  );
}
