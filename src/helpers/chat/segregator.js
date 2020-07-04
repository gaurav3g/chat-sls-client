import moment from "moment";

export default function segregator(messageList) {
  let messageObj = {};

  if (Array.isArray(messageList)) {
    messageList.forEach((message) => {
      const messageDateTime = moment
        .unix(message.created_at)
        .format("MMMM DD, YYYY#hh:mm")
        .split("#");

      if (!(messageDateTime[0] in messageObj)) {
        messageObj[messageDateTime[0]] = [];
      }
      messageObj[messageDateTime[0]].push({
        ...message,
        date: messageDateTime[0],
        time: messageDateTime[1],
      });
    });
  }

  return messageObj;
}
