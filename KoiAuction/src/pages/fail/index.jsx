/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Result } from "antd";
import { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

function FailPage() {
  const params = useGetParams();
  const navigate = useNavigate();

  const transactionId = params("transactionId");
  const vnp_TransactionStatus = params("vnp_TransactionStatus");
  const vnp_TxnRef = params("vnp_TxnRef");
  const vnp_ResponseCode = params("vnp_ResponseCode");
  const vnp_Amount = params("vnp_Amount");

  console.log("transactionId:", transactionId);
  console.log("vnp_TransactionStatus:", vnp_TransactionStatus);

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
        toast.success("Top-up failed!");
      } else {
        throw new Error("Giao dịch không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API callback", error);
      toast.warning({
        message: "Top-up failed",
      });
    }
  };

  useEffect(() => {
    if (vnp_ResponseCode === "01") {
      handleVNPayCallback();

      const timer = setTimeout(() => {
        navigate("/wallet");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [vnp_ResponseCode, navigate]);

  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  return (
    <Result
      status="error"
      title="Payment Failed!!!"
      subTitle={`Transaction number: ${transactionId}. You will be redirected to your wallet in 5 seconds.`}
      extra={[
        <Button key="console" onClick={handleGoBackWallet}>
          Pay Again
        </Button>,
      ]}
    />
  );
}

export default FailPage;
