import './ChatroomList.css';

const ChatroomList = ({Groupchats, PersonalRooms, setChatroom, nickname}) => {
  return (
    <div className="chatroom-list">
      <h3>Chat Rooms</h3>
      {Object.keys(Groupchats).map(groupchat=> (
          <div key={groupchat}>
            <button value={groupchat} className="chatroom-list-item-btn" onClick={(groupchat) => setChatroom(groupchat)} type="button">{groupchat}</button>
          </div>
      ))}
      {Object.keys(PersonalRooms).map(personalRoom=> (
          <div key={personalRoom}>
            <button value={personalRoom} className="chatroom-list-item-btn" onClick={(personalRoom) => setChatroom(personalRoom)} type="button">{personalRoom.replace(nickname, "")}</button>
          </div>
      ))}
    </div>
  )
}

export default ChatroomList