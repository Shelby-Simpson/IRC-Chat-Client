import './ChatroomList.css';

const ChatroomList = ({Chatrooms, SetGroupchat}) => {
  return (
    <div className="chatroom-list">
      <h3>Chat Rooms</h3>
      {Object.keys(Chatrooms).map(chatroom => (
          <div key={chatroom}>
            <button className="chatroom-list-item-btn" onClick={(chatroom) => SetGroupchat(chatroom)} type="button">{chatroom}</button>
          </div>
      ))}
    </div>
  )
}

export default ChatroomList