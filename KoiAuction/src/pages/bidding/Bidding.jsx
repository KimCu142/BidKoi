import "./Bidding.css";
import { Image } from "antd";
import axios from "axios";
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



export default function Bidding() {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false); // Thêm state để quản lý Modal ShippingInfo
  // Thêm state để điều khiển hiển thị của Modal AuctionResult
  const [isAuctionResultModalVisible, setIsAuctionResultModalVisible] = useState(false);
  const [auctionResultData, setAuctionResultData] = useState(null);

  // Thêm hàm để mở Modal kết quả đấu giá
  const showAuctionResultModal = (data) => {
    setAuctionResultData(data);
    setIsAuctionResultModalVisible(true);
  };

  // Hàm để đóng Modal kết quả đấu giá
  const handleAuctionResultModalCancel = () => {
    setIsAuctionResultModalVisible(false);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser); // Parse dữ liệu JSON từ localStorage
      // Kiểm tra và lấy dữ liệu từ userData
      if (userData) {
        setUsername(userData.username); // Đặt username
      } else {
        console.error("Token or username is undefined");
      }
    }
  }, []);

  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const showModal = () => {
    setIsModalVisible2(true);
  };
  const handleCancel = () => {
    setIsModalVisible2(false);
  };



  const checkShippingCreated = async (koiId) => {
    try {
      const response = await api.get(`/shipping/koi/${koiId}`);
      return response.data; // API trả về true/false
    } catch (error) {
      console.error("Error checking shipping:", error);
      return false; // Mặc định trả về false nếu có lỗi
    }
  };


  const [isAuctionEnded, setIsAuctionEnded] = useState(false); // Trạng thái để kiểm tra khi đấu giá kết thúc

  const { roomId } = useParams();
  const [auctionDetails, setAuctionDetails] = useState({});
  const [room, setRoom] = useState([null]);
  const currentBidderId = JSON.parse(localStorage.getItem("user"))?.bidder.id;


  const fireConfetti = () => {
    const duration = 5 * 1000; // Thời gian kéo dài của pháo hoa
    const animationEnd = Date.now() + duration;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 100; // Số hạt mỗi lần bắn
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        colors: ["#bb0000", "#ffffff"], // Tùy chỉnh màu sắc
      });
    }, 200); // Tần suất mỗi lần bắn pháo
  };

  useEffect(() => {
    // Fetch data using Axios

    api
      .get(`http://localhost:8080/BidKoi/auction/active`)
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

  const handleShippingSubmit = () => {
    setIsShippingModalVisible(false);
  };

  const handleShippingModalCancel = () => {
    setIsShippingModalVisible(false);
  };

  useEffect(() => {
    if (auctionDetails.endTime && room) {
      const endTime = new Date(auctionDetails.endTime).getTime();
      const interval = setInterval(async () => {
        if (new Date().getTime() >= endTime) {
          clearInterval(interval); // Xoá interval khi kết thúc thời gian đấu giá
          setIsAuctionEnded(true); // Cập nhật trạng thái đấu giá đã kết thúc
          try {
            console.log("Room :" + roomId);
            const response = await api.get(`http://localhost:8080/BidKoi/placeBid/winner/${roomId}`);
            const winnerName = response.data.data.username;
            console.log("UserName " + winnerName);

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
        }
      }, 1000);

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [auctionDetails.endTime, roomId, room, username, token]);






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
          />
          <div className="Bidding2">
            <div className="Bidding2mini" >
              <BidTable
                initialPrice={room.koi.initialPrice}
                isAuctionEnded={isAuctionEnded}
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
          visible={isShippingModalVisible}
          onCancel={handleShippingModalCancel}
          footer={null}
        >
          <ShippingInfo
            koiId={room.koi.koiId}
            bidderId={currentBidderId}
            breeder={room.koi.breeder}
            roomId={roomId}
            onSubmit={handleShippingSubmit} // Pass the callback here
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
          <ChatBot />
        </Modal>
      </>
    </div>
  );
}

const AuctionInfo = ({ roomId, startTime, endTime, description }) => {
  // Format thời gian để hiển thị
  const formattedStartTime = new Date(startTime).toLocaleDateString("en-GB");
  const formattedEndTime = new Date(endTime).toLocaleDateString("en-GB");
  const auctionInfoContent = (
    <div>
      <p>
        {description}
      </p>

    </div>
  );

  return (
    <div >
      <div className="auctionsInfo">
        <div className="auctionTitle">
          {/* Hiển thị RoomId từ param */}
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
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />{" "}
                Koi Info
              </Button>
            </Popover>
          </Space>
        </div>
      </div>
    </div>
  );
};
