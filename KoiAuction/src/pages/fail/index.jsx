import { Button, Result } from "antd";
import React, { useEffect } from "react";
import useGetParams from "../../hooks/useGetParams";
import { useNavigate } from "react-router-dom";

function FailPage() {
  const params = useGetParams();
  const navigate = useNavigate();

  const transactionId = params("transactionId");
  const vnp_TransactionStatus = params("vnp_TransactionStatus");

  console.log("transactionId:", transactionId);
  console.log("vnp_TransactionStatus:", vnp_TransactionStatus);

  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  return (
    <Result
      status="error"
      title="Payment Failed!!!"
      subTitle={`Transaction number: ${transactionId} Cloud server configuration takes 1-5. Please wait`}
      extra={[
        <Button key="console" onClick={handleGoBackWallet}>
          Pay Again
        </Button>,
      ]}
    />
  );
}

export default FailPage;
