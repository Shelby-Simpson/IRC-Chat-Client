import { useState } from 'react';
import './Chatroom.css';

const Chatroom = ({GroupChatName, Messages, SendMessage}) => {
  const [message, setMessage] = useState("")
  return (
    <div className="chatroom">
      <h2 className="chatroom-name">{GroupChatName}</h2>
      <label htmlFor="message">Send a message:</label>
      <input id="message" value={message} onChange={e => setMessage(e.target.value)} />
      <button type="button" onClick={() => SendMessage(message)}>Send</button>
      {Messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  )
}

export default Chatroom