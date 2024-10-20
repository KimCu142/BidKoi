import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "./Chat.css";
var stompClient = null;

const Chat = () => {
  const { roomId } = useParams();
  const [publicChats, setPublicChats] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    connected: false,
    message: "",
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/BidKoi/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(`/room/${roomId}`, onMessageReceived);
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send(`/app/message/${roomId}`, {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        break;
      case "MESSAGE":
        setPublicChats((prevChats) => [...prevChats, payloadData]);
        break;
      default:
        console.warn("Unknown status received:", payloadData.status);
        break;
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      stompClient.send(
        `/app/message/${roomId}`,
        {},
        JSON.stringify(chatMessage)
      );
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    if (roomId) {
      connect();
    } else {
      alert("Room ID is missing");
    }
  };


  return (
    <div className="Chat">
      <h2>Chat Room {roomId.toUpperCase()}</h2>
      {userData.connected ? (
        <div className="chat-box">
          <div className="chat-content">
            <ul className="chat-messages">
              {publicChats.map((chat, index) => (
                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                  {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                </li>
              ))}
            </ul>
            <div className="send-message">
              <input type="text" className="input-message" placeholder="Enter your message" value={userData.message} onChange={handleMessage} />
              <button type="button" className="send-button" onClick={sendValue}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
        
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}

    </div>
  )

};

export default Chat;
