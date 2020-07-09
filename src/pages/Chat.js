import React, { useState, useEffect, useContext } from "react";
import ChatLayout from "../layouts/ChatLayout";
import { RootContext } from "./../store/Provider";

import validateInput from "./../helpers/message/validateInput";

const Chat = (props) => {
  const context = useContext(RootContext);

  const client = context.state.wsClient;

  const [messageList, setMessageList] = useState([]);
  const [lastStartKey, setLastStartKey] = useState(null);
  const [startKey, setStartKey] = useState(null);
  const [appendAtEnd, setAppendAtEnd] = useState(false);
  const [page, setPage] = useState(0);

  const handleSubmit = (message) => {
    if (message && message !== "" && validateInput(message)) {
      const data = {
        action: "sendMessage",
        token: localStorage.getItem("t2m_accessToken"),
        content: message,
      };
      client.send(JSON.stringify(data));
    }
  };

  const handleLoadmore = () => {
    if (
      startKey &&
      startKey >= 0 &&
      (!lastStartKey || startKey < lastStartKey)
    ) {
      console.log("SEND REQ");
      const data = {
        action: "getRecentMessages",
        LastEvaluatedKey: startKey,
        limit: 20,
      };
      client.send(JSON.stringify(data));
      setPage((prevState) => prevState + 1);
      setLastStartKey(startKey);
    }
  };

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        const data = {
          action: "getRecentMessages",
          limit: 20,
        };
        client.send(JSON.stringify(data));
        // setAppendAtEnd(true);
      };
      client.onmessage = (message) => {
        const messages = JSON.parse(message.data);
        if (startKey === null || startKey >= 0) {
          if (messages.LastEvaluatedKey) setPage((prevState) => prevState + 1);
          if (!messages.end && messages.LastEvaluatedKey) {
            setStartKey(messages.LastEvaluatedKey);
          } else setStartKey(-1);
        }

        if (messages.messages) {
          setAppendAtEnd(messages.end || page < 2 ? true : false);
          if (messages.end)
            setMessageList([...messageList, ...messages.messages]);
          else setMessageList([...messages.messages, ...messageList]);
        }
      };
    }
  }, [client, messageList, page, startKey]);

  useEffect(() => {
    if (page === 1 && messageList.length === 20) {
      setAppendAtEnd(false);
    }
  }, [messageList, page]);

  return (
    <ChatLayout
      title={"Universe"}
      submitHandler={handleSubmit}
      loadmoreHandler={handleLoadmore}
      appendAtEnd={appendAtEnd}
      messages={messageList}
      noMore={startKey <= -1}
    />
  );
};

export default Chat;
