import { useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function Payment({ auctionAmount, roomId }) {
  const paymentAmount = Math.round(auctionAmount * 0.2);
  const [loading, setLoading] = useState(false);

  const bidderId = localStorage.getItem("bidderId");

  const handleDeposit = async () => {
    try {
      const response = await api.post(
        `/placeBid/creation/${bidderId}/${roomId}`,
        { amount: paymentAmount }
      );

      if (response.status === 200) {
        console.log("Đã lưu thông tin đấu giá và tiền cọc thành công.");
      } else {
        console.log("Có lỗi xảy ra khi lưu thông tin đấu giá.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Lỗi khi lưu thông tin đấu giá. Vui lòng thử lại.");
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
