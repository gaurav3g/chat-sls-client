import React, { useState, useEffect } from "react";
import ChatLayout from "../layouts/ChatLayout";
import Block from "../components/Chat/Block";

import validateInput from "./../helpers/message/validateInput";

const Chat = (props) => {
  const { client } = props;
  const [messageList, setMessageList] = useState([]);
  // const [newMsg, setNewMsg] = useState("");
  // const [client, setClient] = useState(null);

  // const handleChange = (event) => {
  //   setNewMsg(event.target.value);
  // };

  const handleSubmit = (message) => {
    if (message && message !== "" && validateInput(message)) {
      const data = {
        action: "sendMessage",
        token: localStorage.getItem("TALK2ME_TEMP_TOKEN"),
        content: message,
      };
      client.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        // console.log("Socket is open!");
        const data = { action: "getRecentMessages", page: 1 };
        client.send(JSON.stringify(data));
      };
      client.onmessage = (message) => {
        const messages = JSON.parse(message.data);
        setMessageList([...messageList, ...messages.messages]);
        // console.log(messages);
      };
    }
  }, [client, messageList]);

  return (
    <ChatLayout title={"Universe"} submitHandler={handleSubmit}>
      {messageList.length ? (
        messageList.map((message, index) => (
          <Block key={index} sender={message.username}>
            {message.content}
          </Block>
        ))
      ) : (
        <div>No messages</div>
      )}
    </ChatLayout>
  );
};

export default Chat;
