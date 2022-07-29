import { useState } from 'react';
// import axios from 'axios';
import './App.css';
import ChatroomList from './ChatroomList/ChatroomList';

const socket = new WebSocket('ws://localhost:8000/')

socket.onclose = (e) => {
  console.log(e.code)
}

socket.onerror = (e) => {
  console.log(e)
}

function App() {
  const nickname = "Name1"

  // const [nickname, setNickname] = useState("")
  const [groupchat, setGroupchat] = useState("Select")
  const [groupchats, setGroupchats] = useState([])
  const [message, setMessage] = useState("")
  const [incomingMessages, setIncomingMessages] = useState([])

  socket.onopen = () => {
    console.log("Connected")
  }

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data["type"] === "groupchats") {
      setGroupchats(data["groupchats"])
    } else if (data["type"] === "message") {
      setIncomingMessages([e.data].concat(incomingMessages))
    }
  }

  const sendMessage = () => {
    socket.send(JSON.stringify({
      type: "message",
      payload: message,
      sender: nickname,
      groupchatname: groupchat,
    }))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat App</h1>
      </header>
      <label htmlFor="message">Send a message:</label>
      <input id="message" value={message} onChange={e => setMessage(e.target.value)} />
      <select id="recipientID" value={groupchat} onChange={(e) => setGroupchat(e.target.value)}>
        <option value="Select">Select a group chat</option>
        <option value="GroupChat0">Group Chat 0</option>
	      <option value="GroupChat1">Group Chat 1</option>
	      <option value="GroupChat2">Group Chat 2</option>
      </select>
      <button type="button" onClick={() => sendMessage()}>Send</button>
      <ChatroomList Chatrooms={groupchats} />
      <div>
        {incomingMessages.map((message) => (
          <p>message</p>
        ))}
      </div>
    </div>
  );
}

export default App;
