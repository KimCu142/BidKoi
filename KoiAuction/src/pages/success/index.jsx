/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Result } from "antd";
import { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const params = useGetParams();
  const navigate = useNavigate();
  const orderID = params("orderID");
  const vnp_TransactionStatus = params("vnp_TransactionStatus");
  console.log("OrderID:", orderID);
  console.log("vnp_TransactionStatus:", vnp_TransactionStatus);

  const postOrderID = async () => {
    try {
      const response = await api.post(`/order/transaction?orderID=${orderID}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (vnp_TransactionStatus === "00") {
      postOrderID();
    } else {
      // chuyen sang trang thanh toan that bai
    }
  }, []);

  const handleGoToAuction = () => {
    navigate("/bid");
  };

  return (
    <Result
      status="success"
      title="Payment successfilly!!!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button key="console" onClick={handleGoToAuction}>
          Go to Auction
        </Button>,
      ]}
    />
  );
}

export default SuccessPage;
