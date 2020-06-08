import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Avatar,
  Chip,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";

const useStyles = makeStyles(() =>
  createStyles({
    chip: {
      margin: 4,
    },
  })
);

export default function NewConversation(props) {
  const { client } = props;
  const classes = useStyles();

  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState([]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const onAdd = () => {
    if (input !== "" && participants.indexOf(input) === -1) {
      setParticipants([...participants, input]);
      setInput("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      action: "setConversation",
      token: localStorage.getItem("TALK2ME_TOKEN"),
      participants: participants,
    };
    client.send(JSON.stringify(data));
    setParticipants([]);
  };

  //   const handleDelete = (chipToDelete) => {
  //     setParticipants((participants) =>
  //       participants.filter((participant) => participant !== chipToDelete.key)
  //     );
  //   };

  const handleDelete = (chipToDelete) => () => {
    debugger;
    setParticipants((participants) =>
      participants.filter((chip) => chip !== chipToDelete)
    );
  };

  const validateForm = () => {
    return participants.length > 0;
  };

  return (
    <form onSubmit={onAdd}>
      <TextField
        label="Add Participants"
        autoFocus
        type="text"
        name="input"
        fullWidth
        margin="normal"
        variant="outlined"
        value={input}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={onAdd}
              >
                <AddBoxIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      ></TextField>
      {participants.map((participant, index) => (
        <Chip
          key={index}
          label={participant}
          variant="outlined"
          onDelete={handleDelete(participant)}
          avatar={<Avatar>{participant.charAt(0).toUpperCase()}</Avatar>}
          className={classes.chip}
        />
      ))}
      <br />
      <Button
        disabled={!validateForm()}
        variant="contained"
        type="submit"
        fullWidth
        color="primary"
        onClick={handleSubmit}
      >
        Create
      </Button>
    </form>
  );
}
