import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import "./PastBid.css";

let stompClient = null;

const PastBids = () => {
  const { roomId } = useParams();
  const [pastBids, setPastBids] = useState([]);

  useEffect(() => {
    connect();
  }, []);


  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/BidKoi/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe(`/bid/${roomId}`, onMessageReceived);
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData.username)
    if (payloadData.status === "MESSAGE") {
      setPastBids((prevBids) => [...prevBids, payloadData]);
    }
  };

  const onError = (err) => {
    console.error(err);
  };

  const handleRefresh = () => {
    setPastBids([]);
    // Optionally, re-fetch or reset the state
  };

  return (
    <Card
      title="Past Bids"
      extra={
        <Button type="default" shape="round" icon={<ReloadOutlined />} onClick={handleRefresh}>
          Refresh
        </Button>
      }
      className="customCard"
      bodyStyle={{

      }}
    >
      <div className="Bids">
        {pastBids.length === 0 ? (
          <>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>No Bids Yet</p>
            <p style={{ color: '#777' }}>Be the first to bid!</p>
          </>
        ) : (
          pastBids
            .sort((a, b) => b.price - a.price)
            .slice(0, 5)
            .map((bid, index) => (
              <div key={index} className="bidEntry">
                <p style={{ fontWeight: 'bold' }}>{bid.username}</p>
                <p>{bid.price}</p>
                <p>{new Date(bid.date).toLocaleString()}</p> {/* Hiển thị thời gian với định dạng dễ đọc */}
              </div>
            ))
        )}

      </div>
    </Card>
  );
};

export default PastBids;
