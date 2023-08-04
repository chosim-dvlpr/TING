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