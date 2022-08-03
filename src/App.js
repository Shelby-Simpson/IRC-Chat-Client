import { useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import ChatroomList from './ChatroomList/ChatroomList';
import Chatroom from './Chatroom/Chatroom';

const socket = new WebSocket('ws://localhost:8000/')

socket.onclose = (e) => {
  console.log(e.code)
}

socket.onerror = (e) => {
  console.log(e)
}

function App() {
  const [nickname, setNickname] = useState("")
  const [displayNickname, setDisplayNickname] = useState(false)
  const [chatroom, setChatroom] = useState("")
  const [groupchats, setGroupchats] = useState({})
  const [personalRooms, setPersonalRooms] = useState({})
  const [clients, setClients] = useState([])
  const [chatroomVisibility, setChatroomVisibility] = useState({})
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [newGroupchatName, setNewGroupchatName] = useState("")
  const [newPersonalRoomName, setNewPersonalRoomName] = useState("Select User")

  const closeModal = () => {
    socket.send(JSON.stringify({
      Type: "connect",
      Request: "",
      SenderName: nickname,
    }))
    setModalIsOpen(false)
    setDisplayNickname(true)
  }

  socket.onopen = () => {
    console.log("Connected")
  }

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    switch (data["Type"]) {
      case "ChatRooms":
        setGroupchats(data["Payload"].split(",").reduce((prev, cur) => ({ ...prev, [cur]: []}), {}))
        setChatroomVisibility(data["Payload"].split(",").reduce((prev, cur) => ({ ...prev, [cur]: false}), {}))
        break
      case "Clients":
        setClients(data["Payload"].split(","))
        break
      case "NewClient":
        setClients(clients.concat([data["Payload"]]))
        // Notify chats
        break
      case "NewGroupChat":
        setGroupchats({ ...groupchats, [data["Payload"]]: []})
        setChatroomVisibility({...chatroomVisibility, [data["Payload"]]: false})
        break
      case "NewPersonalRoom":
        // const personalRoomName = data["Payload"].replace(nickname, "")
        setPersonalRooms({ ...personalRooms, [data["Payload"]]: []})
        setChatroomVisibility({...chatroomVisibility, [data["Payload"]]: false})
        break
      case "ClientDisconnect":
        setClients(clients.filter(client => client !== data["Payload"]))
        break
      default:
        if (data["ChatRoomType"] === "GroupChat") {
          setGroupchats({...groupchats, [data["ChatRoomName"]]: groupchats[data["ChatRoomName"]].concat(`${data["SenderName"]}: ${data["Message"]}`)})
        } else {
          setPersonalRooms({...personalRooms, [data["ChatRoomName"]]: personalRooms[data["ChatRoomName"]].concat(`${data["SenderName"]}: ${data["Message"]}`)})
        }
    }
  }

  const sendGroupChatMessage = (message) => {
    socket.send(JSON.stringify({
      Type: "groupchatmessage",
      Message: message,
      SenderName: nickname,
      ChatRoomName: chatroom,
      ChatRoomType: "GroupChat",
    }))
  }

  const sendPersonalRoomMessage = (message) => {
    socket.send(JSON.stringify({
      Type: "personalroommessage",
      Message: message,
      SenderName: nickname,
      ChatRoomName: chatroom,
      ChatRoomType: "PersonalRoom",
    }))
  }

  const createGroupchat = () => {
    socket.send(JSON.stringify({
      Type: "creategroupchat",
      Name: newGroupchatName,
    }))
  }

  const createPersonalRoom = () => {
    socket.send(JSON.stringify({
      Type: "createpersonalroom",
      RecipientName: newPersonalRoomName,
    }))
  }

  const setChat = (e) => {
    setChatroom(e.target.value)
    chatroomVisibility[e.target.value] = true
    Object.keys(chatroomVisibility).forEach(cr => {
      if (cr !== e.target.value) {
        chatroomVisibility[cr] = false
      }
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat App</h1>
        {displayNickname ? <h4>{`Hi, ${nickname}!`}</h4> : null}
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <p>Please choose a nickname:</p>
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <button type="button" onClick={closeModal}>Submit</button>
      </Modal>
      <span className="chatroom-list-container">
        <input value={newGroupchatName} onChange={(e) => setNewGroupchatName(e.target.value)} />
        <button type="button" onClick={createGroupchat}>New Group Chat</button>
        <select value={newPersonalRoomName} onChange={(e) => setNewPersonalRoomName(e.target.value)}>
          <option value="Select User" disabled={true}>Select User</option>
          {clients.map(client => (
            nickname !== client ? <option value={client}>{client}</option> : null
          ))}
        </select>
        <button type="button" onClick={createPersonalRoom}>New Direct Message</button>
        <ChatroomList Groupchats={groupchats} PersonalRooms={personalRooms} setChatroom={setChat} nickname={nickname} />
      </span>
      <span className="chatrooms-container">
        <div className="">
          {Object.keys(groupchats).map(groupchat => (
            chatroomVisibility[groupchat] ? <Chatroom key={groupchat} ChatRoomName={groupchat} ChatRoomType="GroupChat" Messages={groupchats[groupchat]} SendMessage={sendGroupChatMessage} /> : null
          ))}
          {Object.keys(personalRooms).map(personalRoom => (
            chatroomVisibility[personalRoom] ? <Chatroom key={personalRoom} ChatRoomName={personalRoom} ChatRoomType="PersonalRoom" Messages={personalRooms[personalRoom]} SendMessage={sendPersonalRoomMessage} nickname={nickname} /> : null
          ))}
        </div>
      </span>
    </div>
  );
}

export default App;
