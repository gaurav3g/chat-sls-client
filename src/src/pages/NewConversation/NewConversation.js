import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  // Avatar,
  // Chip,
  // InputAdornment,
  // IconButton,
} from "@material-ui/core";
// import AddBoxIcon from "@material-ui/icons/AddBox";

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

  // const [input, setInput] = useState("");
  const [participant, setParticipant] = useState([]);

  const handleChange = (event) => {
    setParticipant(event.target.value);
  };

  // const onAdd = () => {
  //   if (input !== "" && participants.indexOf(input) === -1) {
  //     setParticipant(input);
  //     setInput("");
  //   }
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      "https://600a8owvjh.execute-api.ap-south-1.amazonaws.com/dev/set-conversation",
      {
        method: "POST",
        body: JSON.stringify({
          action: "setConversation",
          participant: participant,
        }),
        headers: {
          "Content-Type": "application/json",
          "t2m-authtoken": localStorage.getItem("TALK2ME_ACCESS_TOKEN"),
        },
      }
    )
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));

    setParticipant("");
  };

  //   const handleDelete = (chipToDelete) => {
  //     setParticipants((participants) =>
  //       participants.filter((participant) => participant !== chipToDelete.key)
  //     );
  //   };

  // const handleDelete = (chipToDelete) => () => {
  //   debugger;
  //   setParticipants((participants) =>
  //     participants.filter((chip) => chip !== chipToDelete)
  //   );
  // };

  const validateForm = () => {
    return participant.length > 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Add Participants"
        autoFocus
        type="text"
        name="input"
        fullWidth
        margin="normal"
        variant="outlined"
        value={participant}
        onChange={handleChange}
        // InputProps={{
        //   endAdornment: (
        //     <InputAdornment position="end">
        //       <IconButton
        //         aria-label="toggle password visibility"
        //         onClick={onAdd}
        //       >
        //         <AddBoxIcon />
        //       </IconButton>
        //     </InputAdornment>
        //   ),
        // }}
      ></TextField>
      {/* {participants.map((participant, index) => (
        <Chip
          key={index}
          label={participant}
          variant="outlined"
          onDelete={handleDelete(participant)}
          avatar={<Avatar>{participant.charAt(0).toUpperCase()}</Avatar>}
          className={classes.chip}
        />
      ))} */}
      {/* <br /> */}
      <Button
        disabled={!validateForm()}
        variant="contained"
        type="submit"
        fullWidth
        color="primary"
      >
        Create
      </Button>
    </form>
  );
}
