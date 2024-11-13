import { useState, useEffect, useRef } from "react";
import { InfoCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Popover, Button, Space, Modal, message } from "antd";
import styles from "./Auctions.module.css";
import KoiCard from "../../components/KoiCard/KoiCard";
import { useNavigate, useParams } from "react-router-dom";
import Payment from "../payment/Payment";
import { motion } from "framer-motion";
import api from "../../config/axios";


const Auctions = () => {
  const bellSoundUrl =
    "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/pay_notification%2FMariah%20Carey%20-%20IT'S%20TIME!!%20(mp3cut.net).mp3?alt=media";

  const [auctionDetails, setAuctionDetails] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [userData, setUserData] = useState(null); // Thay đổi [] thành null vì user data thường là object
  const navigate = useNavigate();
  const bellAudioRef = useRef(null);
  const { auctionId } = useParams(); // Lấy auctionId từ URL params đúng cách

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser)); // Tách setUserData ra đúng cách
    }
    bellAudioRef.current = new Audio(bellSoundUrl); // Khởi tạo âm thanh chỉ một lần
  }, []);

  useEffect(() => {
    if (auctionId) {
      api
        .get(`/auction/${auctionId}`) // Truy vấn auctionId đúng cách
        .then((response) => {
          const auctionData = response.data;
          setAuctionDetails(auctionData);
          setRooms(auctionData.rooms);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [auctionId]);

  const AuctionInfo = () => {
    const startDate = new Date(auctionDetails.startTime).toLocaleDateString();
    const endDate = new Date(auctionDetails.endTime).toLocaleDateString();

    return (
      <div className={styles.auctionsInfo}>
        <div className={styles.auctionTitle}>
          <span>Auction #{auctionDetails.auctionId} </span>
          <div className={styles.time}>
          <p className={styles.dateRange}>{startDate} - {endDate}</p>
          </div>
        </div>
     
      </div>
    );
  };

  const handleRoomClick = async (room) => {
    const currentTime = new Date().getTime();
    const endTime = new Date(auctionDetails.endTime).getTime();
  
    // Kiểm tra nếu thời gian hiện tại đã vượt qua thời gian kết thúc đấu giá
    if (currentTime > endTime + 86400000) {
      alert("Auction Ended!");
      return; // Ngừng thực hiện nếu đấu giá đã kết thúc
    }
  
    try {
      const response = await api.get(
        `/placeBid/${userData.bidder.id}/${room.roomId}`
      );
  
      const isAllowed = response.data;
      if (isAllowed) {
        handleNavigate(room.roomId); // Điều hướng tới trang đấu giá
      } else {
        setSelectedRoom(room); // Cập nhật room đã chọn
        setIsPaymentModal(true); // Mở modal thanh toán
        bellAudioRef.current.play(); // Phát âm thanh
      }
    } catch (error) {
      console.error("Error calling placeBid API:", error);
    }
  };

  const handleNavigate = (roomId) => {
    if (roomId) {
      navigate(`/auctions/${auctionId}/${roomId}`);
    }
  };

  const handlePayment = () => {
    setIsPaymentModal(false);
    navigate(`/auctions/active/${selectedRoom.roomId}`);
    bellAudioRef.current.pause();
    bellAudioRef.current.currentTime = 0;
  };

  const handleCancel = () => {
    setIsPaymentModal(false);
    bellAudioRef.current.pause(); // Dừng âm thanh từ ref
    bellAudioRef.current.currentTime = 0; // Đặt lại vị trí phát về 0
  };

  return (
    <div className={styles.body}>
      <AuctionInfo />
      <div className={styles.KoiCards}>
        {rooms.map((room) => (
          <div key={room.koi.koiId} onClick={() => handleRoomClick(room)}>
            <KoiCard
              varieties={room.koi.varieties}
              price={room.koi.initialPrice}
              img={room.koi.image}
              id={room.koi.koiId}
              length={room.koi.length}
              age={room.koi.age}
              sex={room.koi.sex}
              status={room.koi.status}
              breeder={room.koi.breeder.name}
              rating={room.koi.rating}
              logo={room.koi.breeder.logo}
            />
          </div>
        ))}
      </div>
      {isPaymentModal && (
        <div className={styles.overlay}>
          <motion.div className={styles.paymentBox}>
            <p className={styles.warningText}>
              <div className={styles.bellIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="30px"
                  height="30px"
                  fill="#108ee9"
                >
                  <path d="M12 2C10.346 2 9 3.346 9 5v.086C6.717 6.598 5 9.134 5 12v4.586L3.293 19.293c-.391.391-.391 1.023 0 1.414.391.391 1.023.391 1.414 0L7 17.414V12c0-2.348 1.37-4.25 3.25-5.067.056.356.131.7.232 1.026C9.707 8.41 8 10.408 8 13v5h8v-5c0-2.592-1.707-4.59-3.482-5.041.101-.326.176-.67.232-1.026C15.63 7.75 17 9.652 17 12v5.414l2.293 2.293c.391.391 1.023.391 1.414 0s.391-1.023 0-1.414L19 16.586V12c0-2.866-1.717-5.402-4-6.914V5c0-1.654-1.346-3-3-3zM12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
                </svg>
              </div>
              Please pay{" "}
              {Math.round(selectedRoom.koi.initialPrice).toLocaleString()} VNĐ
              before participating the room
            </p>
            <Payment
              roomId={selectedRoom.roomId}
              auctionAmount={Math.round(selectedRoom.koi.initialPrice * 0.2)}
              onPaymentSuccess={handlePayment}
            />
            <Button className={styles.paymentButton} onClick={handleCancel}>
              Cancel
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Auctions;
