import React, { Component } from "react";
// import jwt from "jwt-simple";
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

// helper
import generateJWT from "../../helpers/token/generateJWT";

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

  handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      Auth.signIn(this.state.email, this.state.password).then((data) => {
        const token = generateJWT({
          uid: data.username,
          email: data.attributes.email,
          username: data.attributes.preferred_username,
        });
        localStorage.setItem("TALK2ME_TOKEN", token);
        this.props.setAuthenticated(true);
        this.props.history.push("/chat");
      });
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
