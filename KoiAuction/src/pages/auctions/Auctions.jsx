import { useState, useEffect } from "react";
import axios from "axios";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover, Button, Space } from "antd";
import styles from "./Auctions.module.css";
import KoiCard from "../../components/KoiCard/KoiCard";
import { useNavigate, useParams } from "react-router-dom";


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
  // const [koiData, setKoiData] = useState([]);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [rooms, setRooms] = useState([]);
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

  const navigate = useNavigate(); // Khởi tạo navigate



  const handleNavigate = (roomId) => {
    if (roomId) {
      navigate(`/auctions/active/${roomId}`); 
    }
  };

  return (
    <div className={styles.body}>
      <AuctionInfo />
      <div className={styles.KoiCards}>
        {rooms.map((room) => (
          <div key={room.koi.koiId} onClick={() => handleNavigate(room.roomId)}>
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
    </div>
  );
};



export default Auctions;
