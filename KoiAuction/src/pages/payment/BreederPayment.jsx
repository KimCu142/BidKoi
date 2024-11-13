import { useEffect, useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function BreederPayment({ koiRequestAmount, handlePayment }) {
  const paymentAmount = Math.round(koiRequestAmount);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [breederId, setbreederId] = useState(null);
  const [accountId, setaccountId] = useState(null);

  const fetchWalletBalance = async () => {
    try {
      console.log("ACID" + accountId);
      const response = await api.get(`/wallet/view/${accountId}`);
      const { data } = response;

      if (data) {
        console.log("Balance ", data.balance);
        setWalletBalance(data.balance);
      } else {
        console.error("Không thể lấy thông tin ví.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin ví:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setbreederId(userData.breeder.breederID);
      setaccountId(userData.breeder.account.id);
    }
  }, []);

  useEffect(() => {
    console.log("Updated BreederID:", breederId);
    console.log("Updated AccountID:", accountId);
  }, [breederId, accountId]);

  useEffect(() => {
    // Gọi API lấy thông tin ví khi accountId và breederId đã có giá trị
    if (accountId && breederId) {
      fetchWalletBalance();
    }
  }, [accountId, breederId]);

  const handleCreateKoiRequest = async () => {
    if (walletBalance < paymentAmount) {
      console.log("Số dư hiện tại:", walletBalance);
      toast.error("Your balance is insufficient. Please top up to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/breeder/request-koi/${breederId}`, {
        fee: paymentAmount,
      });

      if (response.status === 200) {
        console.log(
          "Yêu cầu đấu giá Koi đã được tạo thành công và tiền đã bị trừ."
        );
        console.log("The Koi request has been created successfully!");
        handlePayment();
      } else {
        console.error("Có lỗi xảy ra khi tạo yêu cầu đấu giá Koi.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
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
        {loading
          ? "Đang xử lý..."
          : `Pay ${paymentAmount.toLocaleString()} VNĐ to create Koi Request`}
      </button>
      <p className={styles.participationInfo}>
        Please note: Creating a Koi request will deduct the specified amount
        from your wallet.
      </p>
    </div>
  );
}

BreederPayment.propTypes = {
  koiRequestAmount: PropTypes.number.isRequired,
  KoiId: PropTypes.string.isRequired,
};

export default BreederPayment;
