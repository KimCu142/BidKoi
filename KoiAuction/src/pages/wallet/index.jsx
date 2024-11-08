import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import useGetParams from "../../hooks/useGetParams";
import styles from "./index.module.scss";
import Transactions from "../../components/Transactions/Transactions";

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

  const accountId = UserData?.role === "BIDDER" && UserData.bidder
    ? UserData.bidder.account.id
    : UserData.role === "BREEDER" && UserData.breeder
    ? UserData.breeder.account.id
    : null;

  const fetchBalance = async () => {
    try {
      const response = await api.get(`/wallet/view/${accountId}`);
      setCurrentBalance(response.data || 0);
    } catch (error) {
      console.error("Error fetching wallet balance", error);
      toast.error("Unable to fetch wallet balance. Please try again.");
    }
  };



  const handleVNPayCallback = async () => {
    try {
      const response = await api.get(`/wallet/vnpay-callback`, {
        params: {
          vnp_TxnRef,
          vnp_ResponseCode,
          vnp_Amount,
        },
      });

      if (response.data.includes("successfully")) {
        toast.success("Recharge successful! Your balance has been updated.");
        await fetchBalance();
      } else {
        toast.warning("Recharge was unsuccessful. Please try again.");
      }
    } catch (error) {
      console.error("Error during VNPay callback", error);
      toast.error("An error occurred during the recharge process.");
    }
  };

  const handleRecharge = async () => {
    if (!balance || isNaN(balance) || balance <= 0) {
      toast.warning("Please enter a valid amount!");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post(
        `/wallet/${accountId}`,
        { balance: parseFloat(balance) },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = response;
      if (data.includes("https")) {
        setPaymentUrl(data);
        toast.info("Redirecting to VNPay...");
        setTimeout(() => (window.location.href = data), 1000);
      } else {
        toast.error("Failed to retrieve payment URL. Please try again.");
      }
    } catch (error) {
      console.error("Error during recharge request", error);
      toast.error("Recharge request failed. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchBalance();
    }
    if (vnp_ResponseCode === "00") {
      handleVNPayCallback();
    }
  }, [accountId, vnp_ResponseCode]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recharge Wallet</h2>

      <div className={styles.balance}>
        <label>Current Balance: </label>
        <strong>{Number(currentBalance.balance).toLocaleString()} VND</strong>
      </div>
      <div className={styles.inputGroup}>
        <label>Amount to Recharge: </label>
        <input
          className={styles.inputLabel}
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Enter amount..."
        />
      </div>

      <button
        className={styles.button}
        onClick={handleRecharge}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Recharge via VNPay"}
      </button>

      {/* Transactions list */}
      <Transactions accountId={accountId} />

      {paymentUrl && (
        <div className={styles.paymentInfo}>
          <p>
            Redirecting to VNPay... If not redirected, click{" "}
            <a href={paymentUrl} className={styles.paymentLink}>
              here
            </a>{" "}
            to continue to payment.
          </p>
        </div>
      )}
    </div>
  );
}

export default Wallet;
