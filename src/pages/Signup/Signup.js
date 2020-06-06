import React, { Component } from "react";
import jwt from "jwt-simple";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

// layout
import LoginLayout from "../../layouts/LoginLayout";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      gender: "",
      newUser: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.username.length > 0 &&
      this.state.gender.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes: {
          gender: this.state.gender,
          preferred_username: this.state.username,
        },
      });
      this.setState({
        newUser,
      });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
  };

  // handleSubmit(event) {
  //   event.preventDefault();
  //   this.setState({ error: "" });
  //   try {
  //     if (this.state.username && this.state.username !== "") {
  //       const token = jwt.encode(
  //         { username: this.state.username },
  //         "#0wc-0-$@$14e8rbk#bke_9rg@nglfdc3&6z_r6nx!q6&3##l=",
  //         "HS256"
  //       );
  //       localStorage.setItem("username", token);
  //     }

  //     this.state.email &&
  //       this.state.email !== "" &&
  //       localStorage.setItem("email", this.state.email);

  //     if (
  //       localStorage.getItem("username") &&
  //       localStorage.getItem("username") !== "" &&
  //       localStorage.getItem("email") &&
  //       localStorage.getItem("email") !== ""
  //     ) {
  //       return (window.location.href = "/chat");
  //     }
  //   } catch (error) {
  //     this.setState({ error: error.message });
  //   }
  // }

  handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      this.props.setAuthenticated(true);
      Auth.currentUserInfo()
        .then((data) => {
          const token = jwt.encode(
            { username: data.username },
            process.env.REACT_APP_API_SECRET,
            "HS256"
          );
          localStorage.setItem("username", token);
        })
        .catch((err) => console.log(err));
      this.props.history.push("/chat");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <TextField
          label="Confirmation Code"
          autoFocus
          type="tel"
          name="confirmationCode"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.confirmationCode}
          onChange={this.handleChange}
        ></TextField>
        <Button
          disabled={!this.validateConfirmationForm()}
          variant="contained"
          type="submit"
          fullWidth
          color="primary"
        >
          Verify
        </Button>
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          label="Username"
          autoFocus
          type="text"
          name="username"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.username}
          onChange={this.handleChange}
        ></TextField>
        <TextField
          label="Email"
          autoFocus
          type="email"
          name="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.email}
          onChange={this.handleChange}
        ></TextField>
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={this.state.gender}
            onChange={this.handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Password"
          autoFocus
          type="password"
          name="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.password}
          onChange={this.handleChange}
        ></TextField>
        <TextField
          label="Confirm Password"
          autoFocus
          type="password"
          name="confirmPassword"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
        ></TextField>
        <Button
          variant="contained"
          type="submit"
          size="large"
          fullWidth
          color="primary"
          disabled={!this.validateForm()}
        >
          Signup
        </Button>
      </form>
    );
  }

  render() {
    return (
      <LoginLayout>
        <div className="Signup">
          {this.state.newUser === null
            ? this.renderForm()
            : this.renderConfirmationForm()}
        </div>
        <br />
        <Typography align="center" paragraph variant="body1">
          Already a member? <Link to="/signin">Sign In</Link>
        </Typography>
      </LoginLayout>
    );
  }
}
