import React, { useEffect, useState } from 'react';
import { Card, Input, Button } from 'antd';
import "./BidTable.css";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';

let stompClient = null;

export default function BidTable() {
  const [bidTable, setBidTable] = useState([]);
  const { roomId } = useParams();
  const [bidderId, setBidderId] = useState('');
  const [bidData, setBidData] = useState({
    connected: false,
    price: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser); // Parse the JSON string
      setBidderId(userData.bidder.id); // Access bidder.id
      console.log("Bidderid : " + userData.bidder.id); // Log the bidder's id
    }
  
    connect();
  }, []);
  

  const connect = () => {
    let Sock = new SockJS('http://localhost:8080/BidKoi/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setBidData({ ...bidData, connected: true });
    stompClient.subscribe(`/bid/${roomId}`, onMessageReceived);
  }

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        break;
      case "MESSAGE":
        setBidTable((prevBids) => [...prevBids, payloadData]);
        break;
      default:
        console.warn("Unknown status received:", payloadData.status);
        break;
    }
  };

  const handleBidAmount = (event) => {
    const { value } = event.target;
    setBidData({ ...bidData, price: value });
  }

  const sendBid = () => {
    if (stompClient && bidData.price && bidderId) {
      const bidMessage = {
        userId: bidderId,
        price: bidData.price,
        status: "MESSAGE"
      };
      stompClient.send(`/app/bid/${roomId}`, {}, JSON.stringify(bidMessage));
      setBidData({ ...bidData, price: "" });
    }
  }

  const onError = (err) => {
    console.error("Connection error", err);
  }

  return (
    <Card
    title={<span style={{ fontSize: '30px' }}>Auction</span>}
      className="custome-card"
    >
      <div className="BidinPut">
      <Input
        placeholder="Enter bid amount"
        value={bidData.price}
        onChange={handleBidAmount}
        style={{
          borderRadius: '20px',
          padding: '15px 15px',
          width: '60%',
        }}
      />
      <Button 
        type="primary" 
        shape="round" 
        onClick={sendBid}
      >
        Place Bid
      </Button>
      </div>
     
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        (Minimum bid: $$$, Increments of $$ only)
      </p>
      <Button
        style={{
          marginTop: '20px',
          width: '100%',
          backgroundColor: '#595959',
          color: 'white',
          borderRadius: '20px',
        }}
      >
        Current Bid: $$$
      </Button>
    </Card>
  );
};
