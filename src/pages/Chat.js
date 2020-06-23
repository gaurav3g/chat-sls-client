import React, { useState, useEffect } from "react";
import ChatLayout from "../layouts/ChatLayout";

const Chat = (props) => {
  const { client } = props;
  const [messageList, setMessageList] = useState([]);
  // const [newMsg, setNewMsg] = useState("");
  // const [client, setClient] = useState(null);

  // const handleChange = (event) => {
  //   setNewMsg(event.target.value);
  // };

  const handleSubmit = (message) => {
    const data = {
      action: "sendMessage",
      token: localStorage.getItem("TALK2ME_TOKEN"),
      content: message,
    };
    client.send(JSON.stringify(data));
  };

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        // console.log("Socket is open!");
        const data = { action: "getRecentMessages" };
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
          <div key={index}>
            <small>{message.username} :</small> {message.content}
          </div>
        ))
      ) : (
        <div>No messages</div>
      )}
    </ChatLayout>
  );
};

export default Chat;
