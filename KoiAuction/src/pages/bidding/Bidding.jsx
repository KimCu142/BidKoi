import "./Bidding.css";
import { Image } from "antd";
import { useState, useEffect } from "react";
import { InfoCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Popover, Button, Space, Modal, FloatButton } from "antd";
import KoiTable from "../../components/KoiTable/KoiTable";
import { useParams } from "react-router-dom";
import BidTable from "../../components/KoiTable/BidTable";
import ChatBot from "../../components/KoiTable/ChatBot";
import Chat from "../Chat/Chat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import confetti from "canvas-confetti";
import ShippingInfo from "../ComfirmShipping/ShippingInfo";
import api from "../../config/axios";
import AuctionResult from "../../components/Result/Result";
import { useCallback } from 'react';

export default function Bidding() {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false); 
  const [isAuctionResultModalVisible, setIsAuctionResultModalVisible] = useState(false);
  const [auctionResultData, setAuctionResultData] = useState(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const { roomId } = useParams();
  const [auctionDetails, setAuctionDetails] = useState({});
  const [room, setRoom] = useState([null]);
  const currentBidderId = JSON.parse(localStorage.getItem("user"))?.bidder.id;
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData) {
        setUsername(userData.username);
      } else {
        console.error("Token or username is undefined");
      }
    }
  }, []);

  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 100;
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        colors: ["#bb0000", "#ffffff"],
      });
    }, 200);
  };

  useEffect(() => {
    api
      .get(`/auction/active`)
      .then((response) => {
        const auctionData = response.data.data;
        setAuctionDetails(auctionData);
        const selectedRoom = auctionData.rooms.find(
          (room) => room.roomId === parseInt(roomId)
        );
        setRoom(selectedRoom);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [roomId]);

  useEffect(() => {
    // Chỉ tạo interval nếu đấu giá chưa kết thúc và có thời gian kết thúc hợp lệ
    if (auctionDetails.endTime && !isAuctionEnded) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const auctionEndTime = new Date(auctionDetails.endTime).getTime();
        
        if (auctionEndTime <= currentTime && !isAuctionEnded) {
          handleAuctionEnd();
        }
      }, 1000); // Kiểm tra mỗi giây một lần
  
      // Cleanup function để dọn dẹp interval khi component bị tháo gỡ
      return () => clearInterval(interval);
    }
  }, [auctionDetails.endTime, isAuctionEnded]);

  const handleShippingSubmit = () => {
    setIsShippingModalVisible(false);
  };

  const handleShippingModalCancel = () => {
    setIsShippingModalVisible(false);
  };

  const handleAuctionEnd = async () => {
    setIsAuctionEnded(true); // Kết thúc đấu giá
    try {
      const response = await api.get(`/placeBid/winner/${roomId}`);
      const winnerName = response.data.data.username;

      if (username === winnerName) {
        fireConfetti();
        toast.success("Congratulations, you've won this auction!", {
          style: { backgroundColor: '#d4edda', color: '#155724' },
        });

        const isShippingCreated = await checkShippingCreated(room.koi.koiId);
        if (!isShippingCreated) {
          setIsShippingModalVisible(true); // Hiển thị modal nếu chưa tạo shipping
        }
      } else {
        showAuctionResultModal(response.data.data);
        toast.info("Unfortunately, you didn't win this auction. Better luck next time!", {
          style: { backgroundColor: '#f8d7da', color: '#721c24' },
        });
      }
    } catch (error) {
      console.error("Error fetching winner:", error);
    }
  };

  const checkShippingCreated = async (koiId) => {
    try {
      const response = await api.get(`/shipping/koi/${koiId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking shipping:", error);
      return false;
    }
  };

  const showAuctionResultModal = (data) => {
    setAuctionResultData(data);
    setIsAuctionResultModalVisible(true);
  };

  const handleAuctionResultModalCancel = () => {
    setIsAuctionResultModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible2(true);
  };

  const handleCancel = () => {
    setIsModalVisible2(false);
  };

  if (!room || !room.koi) {
    return <div>Loading...</div>;
  }

  return (
    <div className="BiddingPage ">
      <div>
        <AuctionInfo
          roomId={roomId}
          startTime={auctionDetails.startTime}
          endTime={auctionDetails.endTime}
          description={room.koi.description}
        />
      </div>
      <div className="Bidding">
        <div className="Visual">
          <div className="img">
            <Image className="custom-image" src={room.koi.image} />
          </div>
          <div style={{ width: '100%', height: '30%', overflow: 'hidden' }}>
            <video
              src={room.koi.video}
              controls
              style={{
                paddingTop: '10px',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              alt="Koi Video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="KoiTable">
          <KoiTable
            name={room.koi.varieties}
            initialPrice={room.koi.initialPrice}
            id={room.koi.koiId}
            rating={5}
            sex={room.koi.sex}
            length={room.koi.length}
            breeder={room.koi.breeder.name}
            age={room.koi.age}
            status={room.koi.status}
            endTime={auctionDetails.endTime}
            immediatePrice={room.koi.immediatePrice}
          />
          <div className="Bidding2">
            <div className="Bidding2mini">
              <BidTable
                initialPrice={room.koi.initialPrice}
                immediatePrice={room.koi.immediatePrice}
                isAuctionEnded={isAuctionEnded}
                onAuctionEnd={handleAuctionEnd} // Thêm callback onAuctionEnd
              />
            </div>
            <div className="Chat2">
              <Chat />
            </div>
          </div>
        </div>
      </div>

      <>
        <Modal
          title="Kết quả đấu giá"
          visible={isAuctionResultModalVisible}
          onCancel={handleAuctionResultModalCancel}
          footer={null}
        >
          {auctionResultData && <AuctionResult data={auctionResultData} />}
        </Modal>
        <Modal
          title="Shipping Information"
          open={isShippingModalVisible}
          onCancel={handleShippingModalCancel}
          footer={null}
          maskClosable={false} 
          closable={false} 
        >
          <ShippingInfo
            koiId={room.koi.koiId}
            bidderId={currentBidderId}
            breeder={room.koi.breeder}
            roomId={roomId}
            onSubmit={handleShippingSubmit}
          />
        </Modal>
        <FloatButton
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<CustomerServiceOutlined />}
          onClick={showModal}
        />

        <Modal
          title="Chat"
          visible={isModalVisible2}
          onCancel={handleCancel}
          footer={null}
        >
          <ChatBot
          name={room.koi.varieties}
          initialPrice={room.koi.initialPrice}
          id={room.koi.koiId}
          rating={5}
          sex={room.koi.sex}
          length={room.koi.length}
          breeder={room.koi.breeder.name}
          age={room.koi.age}
          status={room.koi.status}
          endTime={auctionDetails.endTime}
          immediatePrice={room.koi.immediatePrice}
          />
        </Modal>
      </>
    </div>
  );
}

const AuctionInfo = ({ roomId, startTime, endTime, description }) => {
  const formattedStartTime = new Date(startTime).toLocaleDateString("en-GB");
  const formattedEndTime = new Date(endTime).toLocaleDateString("en-GB");
  const auctionInfoContent = (
    <div>
      <p>{description}</p>
    </div>
  );

  return (
    <div>
      <div className="auctionsInfo">
        <div className="auctionTitle">
          <span>Auction #{roomId}</span>
          <div className="time">
            <p className="">{formattedStartTime} - {formattedEndTime}</p>
          </div>
        </div>
        <div>
          <Space wrap>
            <Popover
              content={auctionInfoContent}
              title="Koi Info"
              trigger="click"
              placement="bottom"
            >
              <Button className="Button">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} /> Koi Info
              </Button>
            </Popover>
          </Space>
        </div>
      </div>
    </div>
  );
};
