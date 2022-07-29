import './ChatroomList.css';

const ChatroomList = ({Chatrooms}) => {
  return (
    <div>
      {Chatrooms.map(chatroom => (
        <div>
          <p>{chatroom}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatroomList