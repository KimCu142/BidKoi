import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "./Chat.css";
import api from "../../config/axios";

var stompClient = null;

const Chat = () => {
  const { roomId } = useParams();
  const [publicChats, setPublicChats] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    connected: false,
    message: "",
  });

  const scrollbarsRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData?.username) {
        setUserData((prevData) => ({ ...prevData, username: userData.username }));
      } else {
        console.error("Token or username is undefined");
      }
    }
  }, []);

  useEffect(() => {
    if (userData.username && !userData.connected) {
      fetchPastChats();
      connect();
    }
  }, [userData.username]);

  useEffect(() => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  }, [publicChats]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/BidKoi/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData((prevData) => ({ ...prevData, connected: true }));
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

  const fetchPastChats = async () => {
    try {
      const response = await api.get(`/chat/${roomId}`);
      const data = response.data;
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setPublicChats(sortedData);
    } catch (error) {
      console.error("Error fetching past chats:", error);
    }
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

  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => console.log("Disconnected"));
      }
    };
  }, []);

  return (
    <div className="Chat">
      <h2>Chat Room {roomId.toUpperCase()}</h2>
      {userData.connected ? (
        <div className="chat-box">
          <Scrollbars style={{ height: 400 }} autoHide ref={scrollbarsRef}>
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
            </div>
          </Scrollbars>
          <div className="send-message">
            <input type="text" className="input-message" placeholder="Enter your message" value={userData.message} onChange={handleMessage} />
            <button type="button" className="send-button" onClick={sendValue}>Send</button>
          </div>
        </div>
      ) : (
        <div className="register">
          <button type="button" onClick={connect}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
