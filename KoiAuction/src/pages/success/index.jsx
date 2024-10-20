/* eslint-disable no-unused-vars */
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
        toast.success("Nạp tiền thành công! Số dư của bạn đã được cập nhật.");
      } else {
        throw new Error("Giao dịch không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API callback", error);
      toast.warning({
        message: "Nạp tiền thất bại",
        description: "Có lỗi xảy ra khi xử lý giao dịch. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    if (vnp_ResponseCode === "00") {
      handleVNPayCallback(); // Gọi API nếu giao dịch thành công
    } else {
      toast.error({
        message: "Thanh toán thất bại",
        description: "Giao dịch không thành công. Vui lòng thử lại!",
      });
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
