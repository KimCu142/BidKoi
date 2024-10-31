/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import useGetParams from "../../hooks/useGetParams";
import styles from "./index.module.scss";

function Wallet() {
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  const params = useGetParams();
  const vnp_TxnRef = params("vnp_TxnRef");
  const vnp_ResponseCode = params("vnp_ResponseCode");
  const vnp_Amount = params("vnp_Amount");

  const LocalUser = localStorage.getItem("user");
  const UserData = JSON.parse(LocalUser);
  const accountId = UserData.bidder.account.id;
  console.log(accountId);

  const fetchBalance = async () => {
    try {
      const response = await api.get(`/wallet/view/${accountId}`);
      const { data } = response;
      if (data) {
        setCurrentBalance(data);
      } else {
        console.log("Không lấy được số dư ví");
      }
    } catch (error) {
      console.log("Lỗi khi gọi API lấy số dư ví", error);
    }
  };

  const handleVNPayCallback = async () => {
    try {
      const response = await api.get(`/wallet/vnpay-callback`, {
        params: {
          vnp_TxnRef: vnp_TxnRef,
          vnp_ResponseCode: vnp_ResponseCode,
          vnp_Amount: vnp_Amount,
        },
      });

      if (response.data && response.data.includes("successfully")) {
        toast.success({
          message: "Nạp tiền thành công!",
          description: "Số dư của bạn đã được cập nhật.",
        });

        await fetchBalance();
      }
    } catch (error) {
      console.error("Lỗi khi gọi API callback", error);
      toast.warning({
        message: "Nạp tiền thất bại",
        description: "Có lỗi xảy ra khi xử lý giao dịch. Vui lòng thử lại.",
      });
    }
  };

  const handleRecharge = async () => {
    if (!balance || isNaN(balance) || balance <= 0) {
      toast.warning("Vui lòng nhập số tiền hợp lệ!");
      return;
    }
    try {
      setIsLoading(true);

      const response = await api.post(
        `/wallet/${accountId}`,
        {
          balance: parseFloat(balance), // Gửi số tiền nạp trong request body
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;
      if (data && data.includes("https")) {
        setPaymentUrl(data);
        window.location.href = data;
      } else {
        console.log("Không lấy được URL thanh toán");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API nạp tiền", error);
      toast.error("Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    if (vnp_ResponseCode === "00") {
      handleVNPayCallback();
    }
  }, [accountId, vnp_ResponseCode]);

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Nạp tiền vào ví</h2>

        <div className={styles.balance}>
          <label>Số dư hiện tại trong ví: </label>
          <strong>{currentBalance.balance} VND</strong>
        </div>
        <div className={styles.inputGroup}>
          <lable> Số tiền muốn nạp: </lable>
          <input
            className={styles.inputLabel}
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Nhập số tiền..."
          />
        </div>

        <button
          className={styles.button}
          onClick={handleRecharge}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Nạp tiền qua VNPay"}
        </button>

        {paymentUrl && (
          <div className={styles.paymentInfo}>
            <p>
              Đang chuyển hướng tới VNPAY... Nếu không tự động chuyển, bạn có
              thể nhấn{" "}
              <a href={paymentUrl} className={styles.paymentLink}>
                vào đây
              </a>{" "}
              để thanh toán.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Wallet;
