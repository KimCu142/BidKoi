import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InfoCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Popover, Button, Space, Modal } from "antd";
import styles from "./Auctions.module.css";
import KoiCard from "../../components/KoiCard/KoiCard";
import { useNavigate } from "react-router-dom";
import Payment from "../payment/Payment";
import { motion } from "framer-motion";

const auctionInfoContent = (
  <div>
    <p>
      In-House Auctions have a shorter shipping lead time (1-2 weeks) on average
      and lower overall cost.
    </p>
    <p>
      Koi in this auction are currently being held at Select Koi in Sevierville,
      TN and thus are ready to ship after fasting to ensure safe delivery.
    </p>
    <p>
      A shipping deposit of $110/koi won will be charged at the end of the
      auction, then adjusted when bulk shipping is calculated.
    </p>
  </div>
);

const Auctions = () => {
  const bellSoundUrl =
    "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/pay_notification%2FMariah%20Carey%20-%20IT'S%20TIME!!%20(mp3cut.net).mp3?alt=media";

  // const [koiData, setKoiData] = useState([]);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const navigate = useNavigate();
  const bellAudioRef = useRef(null); // Sử dụng ref để giữ lại đối tượng Audio
  useEffect(() => {
    bellAudioRef.current = new Audio(bellSoundUrl); // Khởi tạo chỉ một lần
  }, []);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/BidKoi/auction/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        const auctionData = response.data.data;
        setAuctionDetails(auctionData);

        setRooms(auctionData.rooms);
        // setKoiData(koiInfo);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const AuctionInfo = () => {
    const startDate = new Date(auctionDetails.startTime).toLocaleDateString();
    const endDate = new Date(auctionDetails.endTime).toLocaleDateString();

    return (
      <div className={styles.auctionsInfo}>
        <div className={styles.auctionTitle}>
          <span>Auction #{auctionDetails.auctionId} </span>
          <div className={styles.time}>
            <p className={styles.dateRange}>{startDate} -</p>
            <p className={styles.dateRange}>{endDate}</p>
            <p className={styles.ended}>Ended 7 days Ago</p>
          </div>
        </div>
        <div>
          <Space wrap>
            <Popover
              content={auctionInfoContent}
              title="In-House Auction Info"
              trigger="click"
            >
              <Button className={styles.Button}>
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />{" "}
                In-House Auction Info
              </Button>
            </Popover>
          </Space>
        </div>
      </div>
    );
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsPaymentModal(true);
    bellAudioRef.current.play();
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

  // const handleNavigate = (roomId) => {
  //   if (roomId) {
  //     navigate(`/auctions/active/${roomId}`);
  //   }
  // };

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
              Please pay {selectedRoom.koi.initialPrice} VNĐ before
              participating the room
            </p>
            <Payment
              accountId="exampleAccountId" // Thay accountId phù hợp cho người dùng hiện tại
              auctionAmount={selectedRoom.koi.initialPrice} // Sử dụng giá ban đầu của Koi cho số tiền thanh toán
              onPaymentSuccess={handlePayment} // Hàm gọi khi thanh toán thành công
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
