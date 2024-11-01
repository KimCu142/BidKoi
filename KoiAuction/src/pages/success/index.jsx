/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Result } from "antd";
import { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SuccessPage() {
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
        toast.success("Top-up successful! Your balance has been updated");
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
    if (vnp_ResponseCode === "00") {
      handleVNPayCallback();
    } else {
      toast.error("Thanh toán thất bại");
      navigate("/fail");
    }
  }, [vnp_ResponseCode]);

  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  return (
    <Result
      status="success"
      title="Payment sucessfully!!!"
      subTitle={`Transaction number: ${vnp_TxnRef} Cloud server configuration takes 1-5`}
      extra={[
        <Button key="console" onClick={handleGoBackWallet}>
          Go back to Wallet
        </Button>,
      ]}
    />
  );
}

export default SuccessPage;
