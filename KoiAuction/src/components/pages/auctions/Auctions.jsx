import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover, Button, Space } from "antd";
import KoiCard from "../../KoiCard/KoiCard";
import styles from "./Auctions.module.css";

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
  return (
    <div className={styles.body}>
      <AuctionInfo />
      <KoiCard />
    </div>
  );
};

const AuctionInfo = () => {
  return (
    <div className={styles.auctionsInfo}>
      <div className={styles.auctionTitle}>
        <span>Auction #1</span>
        <div className={styles.time}>
          <p>28/9/2024 -</p> <p>30/9/2024</p>
        </div>
      </div>
      <div>
        <Space wrap>
          <Popover
            content={auctionInfoContent}
            title="In-House Auction Info"
            trigger="click"
            // Thêm thuộc tính borderRadius vào đây
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
