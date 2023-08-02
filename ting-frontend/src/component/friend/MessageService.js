// import { useState } from 'react';

// function formatMessage(message) {
//   return {
//     id: message.id,
//     value: `${message.value} (${new Date().toLocaleTimeString()})`,
//   };
// }

// function sendMessage({ client, messageToSend, addMessageLog }) {
//   client.send(
//     `/publication/chat/${messageToSend.type}`,
//     {},
//     JSON.stringify(messageToSend),
//   );

//   const formattedMessage = formatMessage(messageToSend);
//   addMessageLog(formattedMessage);
// }

// export default function MessageService() {
//   const [messageLogs, setMessageLogs] = useState([]);

//   const addMessageLog = (message) => {
//     setMessageLogs((prevLogs) => [...prevLogs, message]);
//   };

//   const sendMessage = ({ client, messageToSend }) => {
//     sendMessage({
//       client,
//       messageToSend,
//       addMessageLog,
//     });
//   };

//   return {
//     sendMessage,
//     messageLogs,
//   };
// }



/* eslint-disable class-methods-use-this */

export default class MessageService {
  sendMessage({
    client,
    messageToSend,
  }) {
    client.send(
      `/publication/chat/${messageToSend.type}`,
      {},
      JSON.stringify(messageToSend),
    );
  }
}

export const messageService = new MessageService();