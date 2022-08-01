import { useState } from 'react';
import Modal from 'react-modal';
// import axios from 'axios';
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
  const [groupchat, setGroupchat] = useState("")
  const [groupchats, setGroupchats] = useState({})
  const [groupchatVisibility, setGroupchatVisibility] = useState({})
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [newGroupchatName, setNewGroupchatName] = useState("")

  const closeModal = () => {
    setModalIsOpen(false)
    setDisplayNickname(true)
  }

  socket.onopen = () => {
    console.log("Connected")
    socket.send(JSON.stringify({
      Type: "connect",
      Request: "",
      SenderName: nickname,
    }))
  }

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data["Type"] === "GroupChats") {
      setGroupchats(data["Payload"].split(",").reduce((prev, cur) => ({ ...prev, [cur]: []}), {}))
      setGroupchatVisibility(data["Payload"].split(",").reduce((prev, cur) => ({ ...prev, [cur]: false}), {}))
    } else if (data["Type"] === "NewGroupChat") {
      setGroupchats({ ...groupchats, [data["Payload"]]: []})
    } else {
      setGroupchats({...groupchats, [data["GroupChatName"]]: groupchats[data["GroupChatName"]].concat(`${data["SenderName"]}: ${data["Message"]}`)})
    }
  }

  const sendMessage = (message) => {
    socket.send(JSON.stringify({
      Type: "message",
      Message: message,
      SenderName: nickname,
      GroupChatName: groupchat,
    }))
  }

  const createGroupchat = () => {
    socket.send(JSON.stringify({
      Type: "creategroupchat",
      Name: newGroupchatName,
    }))
  }

  const setGC = (e) => {
    setGroupchat(e.target.innerText)
    groupchatVisibility[e.target.innerText] = true
    Object.keys(groupchatVisibility).forEach(gc => {
      if (gc !== e.target.innerText) {
        groupchatVisibility[gc] = false
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
        <button type="button" onClick={createGroupchat}>Create New</button>
        <ChatroomList Chatrooms={groupchats} SetGroupchat={setGC} />
      </span>
      <span className="chatrooms-container">
        <div className="">
          {Object.keys(groupchats).map(groupchat => (
            groupchatVisibility[groupchat] ? <Chatroom key={groupchat} GroupChatName={groupchat} Messages={groupchats[groupchat]} SendMessage={sendMessage} /> : null
          ))}
        </div>
      </span>
    </div>
  );
}

export default App;
