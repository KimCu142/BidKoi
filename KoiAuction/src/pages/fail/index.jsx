import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function FailPage() {
  const navigate = useNavigate();
  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  return (
    <Result
      status="error"
      title="Payment Failed!!!"
      subTitle={`Transaction fail! Click button to pay again`}
      extra={[
        <Button key="console" onClick={handleGoBackWallet}>
          Pay Again
        </Button>,
      ]}
    />
  );
}

export default FailPage;
