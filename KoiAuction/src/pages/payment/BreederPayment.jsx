import { useEffect, useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function BreederPayment({ koiRequestAmount }) {
  const paymentAmount = Math.round(koiRequestAmount);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const [breederId, setbreederId] = useState({});
  const [accountId, setaccountId] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setbreederId(userData.breeder.id);
      setaccountId(userData.breeder.account.id);
    }
    // Lấy thông tin ví của breeder từ API
    const fetchWalletBalance = async () => {
      try {
        const response = await api.get(`/wallet/view/${accountId}`);
        if (response.status === 200) {
          setWalletBalance(response.data.balance);
        } else {
          console.error("Không thể lấy thông tin ví.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin ví:", error);
      }
    };

    if (breederId) {
      fetchWalletBalance();
    }
  }, [breederId]);

  const handleCreateKoiRequest = async () => {
    if (walletBalance < paymentAmount) {
      toast.error("Số dư của bạn không đủ. Vui lòng nạp thêm để tiếp tục.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/koi/request/${breederId}`, {
        amount: paymentAmount,
      });

      if (response.status === 200) {
        console.log("Yêu cầu đấu giá Koi đã được tạo thành công và tiền đã bị trừ.");
        toast.success("Yêu cầu đấu giá đã được tạo thành công!");
        navigate(`/breeder/dashboard`);
      } else {
        console.error("Có lỗi xảy ra khi tạo yêu cầu đấu giá Koi.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Có lỗi xảy ra khi tạo yêu cầu đấu giá Koi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateKoiRequest}
        className={styles.paymentButton}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : `Pay ${paymentAmount} VNĐ to create Koi Request`}
      </button>
      <p className={styles.participationInfo}>
        Please note: Creating a Koi request will deduct the specified amount from your wallet.
      </p>
    </div>
  );
}

BreederPayment.propTypes = {
  koiRequestAmount: PropTypes.number.isRequired,
  KoiId: PropTypes.string.isRequired,
};

export default BreederPayment;
