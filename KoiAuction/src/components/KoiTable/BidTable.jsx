import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import "./BidTable.css";
import api from '../../config/axios';
let stompClient = null;

const BidTable = ({ initialPrice, immediatePrice, isAuctionEnded, onAuctionEnd }) => {
  const { roomId } = useParams();
  const [bidderId, setBidderId] = useState('');
  const [bidTable, setBidTable] = useState([]);
  const [pastBids, setPastBids] = useState([]);
  const [bidData, setBidData] = useState({
    connected: false,
    price: ''
  });
  const highestBid = pastBids.length === 0
  ? initialPrice
  : Math.max(initialPrice, Math.max(...pastBids.map(bid => parseFloat(bid.price))));


  const [inputError, setInputError] = useState('');
  useEffect(() => {
    fetchPastBids();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setBidderId(userData.bidder.id);
    }
    connect();
  }, []);

  useEffect(() => {
    // Chỉ gọi onAuctionEnd nếu đấu giá chưa kết thúc và điều kiện giá đã đạt giá mua ngay
    if (!isAuctionEnded && immediatePrice && immediatePrice !== 0 && highestBid >= immediatePrice) {
      onAuctionEnd();
    }
  }, [immediatePrice, highestBid, onAuctionEnd, isAuctionEnded]);

  const connect = () => {
    let Sock = new SockJS("https://bidkois.azurewebsites.net/BidKoi/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setBidData({ ...bidData, connected: true });
    stompClient.subscribe(`/bid/${roomId}`, onMessageReceived);
  };

  const fetchPastBids = async () => {
    try {
      const response = await api.get(`/placeBid/${roomId}`);
      const data = response.data;
      setPastBids(data);
    } catch (error) {
      console.error('Error fetching past bids:', error);
    }
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "MESSAGE":
        setBidTable((prevBids) => [...prevBids, payloadData]);
        setPastBids((prevBids) => [...prevBids, payloadData]);
        break;
      default:
        break;
    }
  };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBidAmount = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/,/g, '');

    if (immediatePrice && immediatePrice !== 0 && parseFloat(numericValue) > parseFloat(immediatePrice)) {
      setInputError(`Bid cannot exceed the Buy Now price: ${immediatePrice}`);
      setBidData({ ...bidData, price: formatNumber(immediatePrice) });
    } else {
      setBidData({ ...bidData, price: formatNumber(numericValue) });

      if (parseFloat(numericValue) < parseFloat(minimumBid)) {
        setInputError(`Bid must be higher than Minimum bid: ${minimumBid}`);
      } else {
        setInputError('');
      }
    }
  };

  const sendBid = () => {
    const numericPrice = bidData.price.replace(/,/g, '');
    if (parseFloat(numericPrice) < parseFloat(minimumBid)) {
      message.error(`Your bid must be higher than Minimum bid: ${minimumBid}`);
      return;
    }

    if (immediatePrice && immediatePrice !== 0 && parseFloat(numericPrice) > parseFloat(immediatePrice)) {
      message.error(`Your bid cannot exceed the Buy Now price: ${immediatePrice}`);
      return;
    }

    if (stompClient && numericPrice && bidderId) {
      const bidMessage = {
        userId: bidderId,
        price: numericPrice,
        status: "MESSAGE"
      };
      stompClient.send(`/app/bid/${roomId}`, {}, JSON.stringify(bidMessage));
      setBidData({ ...bidData, price: "" });
    }
  };

  const onError = (err) => {
    console.error("Connection error", err);
  };

  const handleRefresh = () => {
    fetchPastBids();
  };

  const handleImmediateBuy = () => {
    if (stompClient && immediatePrice && bidderId) {
      const immediateBuyMessage = {
        userId: bidderId,
        price: immediatePrice,
        status: "MESSAGE"
      };
      stompClient.send(`/app/bid/${roomId}`, {}, JSON.stringify(immediateBuyMessage));
      message.success(`You have successfully purchased the item at ${parseFloat(immediatePrice).toLocaleString()} VND`);
      if (onAuctionEnd) {
        onAuctionEnd(); // Kết thúc đấu giá sau khi mua ngay
      }
    }
  };


  const increments = (highestBid * 0.05).toFixed(0);
  let minimumBid = (parseFloat(highestBid) + parseFloat(increments)).toFixed(0);

  // Giới hạn giá trị của minimumBid không vượt quá immediatePrice nếu có giá bán ngay
  if (immediatePrice && immediatePrice !== 0) {
    minimumBid = Math.min(minimumBid, immediatePrice).toFixed(0);
  }

  // Check if bidding should be disabled
  const isBiddingDisabled = isAuctionEnded || (immediatePrice && immediatePrice !== 0 && highestBid >= immediatePrice);

  return (
    <>
      <Card
        title={<span style={{ fontSize: '30px' }}>Auction</span>}
        className="custom-card"
      >
        <div className="BidInput">
          <Input
            placeholder={`Enter bid amount ${immediatePrice && immediatePrice !== 0 ? `(Maximum bid: ${immediatePrice})` : ""} (Minimum bid: ${minimumBid})`}
            value={bidData.price}
            onChange={handleBidAmount}
            style={{
              borderRadius: '24px',
              padding: '15px 15px',
              width: '60%',
            }}
            disabled={isBiddingDisabled}
          />
          <Button
            type="primary"
            shape="round"
            style={{
              borderRadius: '24px',
              padding: '15px 15px',
              margin: '5px',
              width: '30%',
            }}
            onClick={sendBid}
            disabled={isBiddingDisabled || parseFloat(bidData.price.replace(/,/g, '')) < parseFloat(minimumBid)}
          >
            Place Bid
          </Button>
          {immediatePrice && immediatePrice !== 0 && (
            <Button
              type="danger"
              shape="round"
              style={{
                borderRadius: '24px',
                padding: '15px 15px',
                margin: '5px',
                width: '30%',
              }}
              onClick={handleImmediateBuy}
              disabled={isAuctionEnded || highestBid >= immediatePrice}
            >
              Buy Now at {parseFloat(immediatePrice).toLocaleString()} VND
            </Button>
          )}
        </div>
        {inputError && (
          <p style={{ color: 'red', marginTop: '10px' }}>{inputError}</p>
        )}
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          (Minimum bid: {parseFloat(minimumBid).toLocaleString()}, Increments of {parseFloat(increments).toLocaleString()} only)
        </p>
        <Button
          style={{
            marginTop: '20px',
            width: '100%',
            backgroundColor: '#595959',
            color: 'white',
            borderRadius: '20px',
          }}
          disabled={isAuctionEnded}
        >
          Current Bid: {highestBid > 0 ? `${highestBid.toLocaleString()} VND` : "No Bids Yet"}
        </Button>
      </Card>

      <Card
        title="Past Bids"
        extra={
          <Button type="default" shape="round" icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
        }
        className="customCard"
      >
        <div className="Bids">
          {pastBids.filter(bid => bid.price > 0).length === 0 ? (
            <>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>No Bids Yet</p>
              <p style={{ color: '#777' }}>Be the first to bid!</p>
            </>
          ) : (
            <>
              <div className="bidHeader">
                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>Username</p>
                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>Price</p>
                <p style={{ fontWeight: 'bold', textAlign: 'left' }}>Date</p>
              </div>

              {pastBids
                .filter(bid => bid.price > 0)
                .sort((a, b) => b.price - a.price)
                .slice(0, 5)
                .map((bid, index) => (
                  <div key={index} className="bidEntry">
                    <p style={{ textAlign: 'left' }}>{bid.username}</p>
                    <p style={{ textAlign: 'left' }}>{parseFloat(bid.price).toLocaleString()}</p>
                    <p style={{ textAlign: 'left' }}>{new Date(bid.date).toLocaleString()}</p>
                  </div>
                ))}
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default BidTable;
