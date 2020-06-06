import React, { Component } from "react";
import jwt from "jwt-simple";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// layout
import LoginLayout from "../../layouts/LoginLayout";
import { Typography } from "@material-ui/core";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
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
      Auth.signIn(this.state.email, this.state.password).then((data) => {
        console.log(data.username);
        const token = jwt.encode(
          { username: data.username },
          process.env.REACT_APP_API_SECRET,
          "HS256"
        );
        localStorage.setItem("username", token);
        this.props.setAuthenticated(true);
        this.props.history.push("/chat");
      });
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
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
        <Button
          variant="contained"
          type="submit"
          size="large"
          fullWidth
          color="primary"
          disabled={!this.validateForm()}
        >
          Signin
        </Button>
      </form>
    );
  }

  render() {
    return (
      <LoginLayout>
        <div className="Signin">{this.renderForm()}</div>
        <br />
        <Typography align="center" paragraph variant="body1">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </LoginLayout>
    );
  }
}
