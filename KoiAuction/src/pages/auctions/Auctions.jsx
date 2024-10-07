import React, { useState, useEffect } from "react";
import axios from "axios";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover, Button, Space } from "antd";

import styles from "./Auctions.module.css";
import KoiCard from "../../components/KoiCard/KoiCard";

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
  const [koiData, setKoiData] = useState([]);

  useEffect(() => {
    // Fetch data using Axios
    axios
      .get("https://66fa0ff3afc569e13a9a4a68.mockapi.io/Auctions")
      .then((response) => setKoiData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className={styles.body}>
      <AuctionInfo />
      <div className={styles.KoiCards}>
        {koiData.map((koi) => (
          <KoiCard
            key={koi.id}
            name={koi.name}
            price={koi.price}
            img={koi.image}
            id={koi.id}
          />
        ))}
      </div>
    </div>
  );
};

const AuctionInfo = () => {
  return (
    <div className={styles.auctionsInfo}>
      <div className={styles.auctionTitle}>
        <span>Auction #1</span>
        <div className={styles.time}>
          <p className={styles.dateRange}>28/9/2024 -</p>{" "}
          <p className={styles.dateRange}>30/9/2024</p>
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

export default Auctions;
