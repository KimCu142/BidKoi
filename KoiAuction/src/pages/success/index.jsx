/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Result } from "antd";
import { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./index.module.css";

function SuccessPage() {
  const params = useGetParams();
  const navigate = useNavigate();

  const transactionId = params("transactionId");
  const vnp_TxnRef = params("vnp_TxnRef");
  const vnp_ResponseCode = params("vnp_ResponseCode");
  const vnp_Amount = params("vnp_Amount");

  console.log("transactionId:", transactionId);

  const handleVNPayCallback = async () => {
    try {
      const response = await api.get(`/wallet/vnpay-callback`, {
        params: {
          vnp_TxnRef: vnp_TxnRef,
          vnp_ResponseCode: vnp_ResponseCode,
          vnp_Amount: vnp_Amount,
        },
      });
    } catch (error) {
      console.error("Lỗi khi gọi API callback", error);
    }
  };

  useEffect(() => {
    if (vnp_ResponseCode === "00") {
      handleVNPayCallback();
      toast.success("Top-up successful! Your balance has been updated");

      const timeout = setTimeout(() => {
        handleGoBackWallet();
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      handleVNPayCallback();
      toast.error("Top-up fail! Please try again.");
      navigate("/fail");
    }
  }, [vnp_ResponseCode]);

  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.resultContainer}>
        <Result
          status="success"
          title={<div className={styles.title}>Payment successfully!!!</div>}
          subTitle={
            <div className={styles.subTitle}>
              Thank you for using our service. You will be redirected to your
              wallet in 5 seconds.
            </div>
          }
          extra={[
            <Button
              key="console"
              className={styles.button}
              onClick={handleGoBackWallet}
            >
              Go back to Wallet
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}

export default SuccessPage;
