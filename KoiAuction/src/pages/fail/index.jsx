/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./index.module.css";

function FailPage() {
  const navigate = useNavigate();

  const handleGoBackWallet = () => {
    navigate("/wallet");
  };

  useEffect(() => {
    // Set timeout to navigate to wallet page after 5 seconds
    const timeout = setTimeout(() => {
      handleGoBackWallet();
    }, 5000);

    // Clear timeout if component unmounts to prevent memory leak
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.resultContainer}>
        <Result
          status="error"
          title={<div className={styles.title}>Payment Failed!!!</div>}
          subTitle={
            <div className={styles.subTitle}>
              Transaction failed! You will be redirected to the wallet in 5
              seconds. Click the button to try again.
            </div>
          }
          extra={[
            <Button
              key="console"
              className={styles.button}
              onClick={handleGoBackWallet}
            >
              Pay Again
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}

export default FailPage;
