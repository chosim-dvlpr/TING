import useMessageStore from './useMessageStore';

export default function Room() {
  const messageStore = useMessageStore();

  const {
    connected,
    messageEntered,
    messageLogs,
  } = messageStore;

  const beforeUnloadListener = (() => {
    if (connected) {
      messageStore.disconnect();
    }
  });

  window.addEventListener('beforeunload', beforeUnloadListener);

  const handleSubmit = (event) => {
    event.preventDefault();
    messageStore.sendMessage({ type: 'message' });
  };

  const handleChangeInput = (event) => {
    const { value } = event.target;
    messageStore.changeInput(value);
  };

  if (!connected) {
    return (
      null
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-to-send">
          메시지 입력
        </label>
        <input
          type="text"
          value={messageEntered}
          onChange={handleChangeInput}
        />
        <button
          type="submit"
        >
          전송
        </button>
      </form>
      <ul>
        {messageLogs.map((message) => (
          <li key={message.id}>
            {message.value}
          </li>
        ))}
      </ul>
    </div>
  );
}