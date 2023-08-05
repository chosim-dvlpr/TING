// import useMessageStore from '../hooks/useMessageStore';
import useMessageStore from "./useMessageStore";

export default function RoomList() {
  const messageStore = useMessageStore();

  const {
    connected,
    currentRoomIndex,
    roomIndices,
  } = messageStore;

  const handleClickEnterRoom = ({ newRoomIndex }) => {
    if (connected && newRoomIndex !== currentRoomIndex) {
      messageStore.disconnect(currentRoomIndex);
    }
    messageStore.connect(newRoomIndex);
  };
  

  const handleClickQuitRoom = async () => {
    messageStore.disconnect(currentRoomIndex);
  };

  return (
    <div>
      <ul>
        {roomIndices.map((roomIndex) => (
          <li key={roomIndex}>
            <button
              type="button"
              disabled={roomIndex === currentRoomIndex}
              onClick={() => handleClickEnterRoom({
                previousRoomIndex: currentRoomIndex,
                newRoomIndex: roomIndex,
              })}
            >
              채팅방
              {' '}
              {roomIndex}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!connected}
        onClick={() => handleClickQuitRoom()}
      >
        연결 종료
      </button>
    </div>
  );
}