import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import Chat from "./Chat";
import generateJWT from "../helpers/generateJWT";

export default function Home() {
  const [username, setUsername] = useState(
    localStorage.getItem("TALK2ME_TOKEN") || ""
  );

  const handleChange = (event) => {
    const userN = event.target.value;
    setUsername(userN);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = generateJWT({ username: username });
    localStorage.setItem("TALK2ME_TOKEN", token);
  };

  const validateForm = () => {
    return username.length > 0;
  };

  return localStorage.getItem("TALK2ME_TOKEN") &&
    localStorage.getItem("TALK2ME_TOKEN") !== "" ? (
    <Chat />
  ) : (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        autoFocus
        type="text"
        name="input"
        fullWidth
        margin="normal"
        variant="outlined"
        value={username}
        onChange={handleChange}
      ></TextField>
      <Button
        disabled={!validateForm()}
        variant="contained"
        type="submit"
        fullWidth
        color="primary"
      >
        Enter to Chat Room
      </Button>
    </form>
  );
}
