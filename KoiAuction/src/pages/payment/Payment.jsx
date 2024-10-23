
import { useEffect, useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Payment({ auctionAmount, roomId }) {
  const paymentAmount = Math.round(auctionAmount );
  const [loading, setLoading] = useState(false);
  const [bidderId, setbidderId] = useState({});
  const navigate = useNavigate();
  const handleNavigate = (roomId) => {
    if (roomId) {
      navigate(`/auctions/active/${roomId}`);
    }
  };

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userData = JSON.parse(storedUser);
   setbidderId(userData.bidder.id);
  }
}, []);
  const handleDeposit = async () => {
    try {
      const response = await api.post(
        `/placeBid/creation/${bidderId}/${roomId}`,
        { amount: paymentAmount }
      );

      if (response.status === 200) {
        console.log("Đã lưu thông tin đấu giá và tiền cọc thành công.");
        handleNavigate(roomId);
      } else {
        console.log("Có lỗi xảy ra khi lưu thông tin đấu giá.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Số dư của bạn không đủ. Vui lòng nạp thêm để tiếp tục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDeposit}
        className={styles.paymentButton}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : `Pay ${paymentAmount} VNĐ`}
      </button>
      <p className={styles.participationInfo}>
        Get in the game! Your participation fee is just 20% of the initial bid
        price
      </p>
    </div>
  );
}

Payment.propTypes = {
  auctionAmount: PropTypes.number.isRequired,
  roomId: PropTypes.string.isRequired,
};
export default Payment;
