
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import useGetParams from "../../hooks/useGetParams";
import styles from "./index.module.scss";
import { motion } from "framer-motion";
import Transactions from "../../components/Transactions/Transactions";

function Wallet() {
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  const denominations = [
    { value: 1000000 },
    { value: 3000000 },
    { value: 5000000 },
    { value: 10000000 },
    { value: 15000000 },
    { value: 20000000 },
  ];

  const LocalUser = localStorage.getItem("user");
  const UserData = JSON.parse(LocalUser);


  // Kiểm tra role và lấy accountId tương ứng
  let accountId = null;
  if (UserData.role === "BIDDER" && UserData.bidder) {
    accountId = UserData.bidder.account.id;
  } else if (UserData.role === "BREEDER" && UserData.breeder) {
    accountId = UserData.breeder.account.id;
  }
  console.log(accountId);


  const fetchBalance = async () => {
    try {
      const response = await api.get(`/wallet/view/${accountId}`);

      const { data } = response;
      if (data) {
        setCurrentBalance(data);
      } else {
        console.log("Failed to retrieve wallet balance");
      }
    } catch (error) {
      console.log("Error fetching wallet balance", error);
    }
  };

  const handleRecharge = async () => {
    const plainBalance = balance.replace(/,/g, "");

    if (!plainBalance || isNaN(plainBalance) || plainBalance <= 0) {
      toast.warning("Please enter a valid amount!");
      return;

    }


    if (parseFloat(plainBalance) > 20000000) {
      toast.warning("The maximum top-up amount is 20,000,000 VND!");
      return;
    }

    try {
      setIsLoading(true);


    try {
      const response = await api.post(
        `/wallet/${accountId}`,

        {
          balance: parseFloat(plainBalance), // Gửi số tiền nạp trong request body
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }

      );

      const { data } = response;
      if (data.includes("https")) {
        setPaymentUrl(data);
        toast.info("Redirecting to VNPay...");
        setTimeout(() => (window.location.href = data), 1000);
      } else {
        console.log("Failed to retrieve payment URL");
      }
    } catch (error) {
      console.error("Error calling top-up API", error);
      toast.error("An error occurred during the top-up. Please try again!");

    } finally {
      setIsLoading(false);
    }
  };

  const handleBalanceChange = (e) => {
    const input = e.target.value.replace(/,/g, "");
    if (!isNaN(input)) {
      setBalance(Number(input).toLocaleString());
    }
  };

  const selectDenomination = (value) => {
    setBalance(value.toLocaleString());
  };

  useEffect(() => {
    fetchBalance();
  }, [accountId]);

  return (
    <div className={styles.formContainer}>
      <motion.div
        className={styles.walletContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className={styles.title}>Top-up Wallet</h2>

        <div className={styles.balance}>
          <label>
            Current wallet balance:{" "}
            <strong>
              {Number(currentBalance.balance).toLocaleString()} VND
            </strong>
          </label>
        </div>

        <h3 className={styles.denominationTitle}>Choose Denomination</h3>
        <div className={styles.denominationSelector}>
          {denominations.map((denom) => (
            <motion.button
              key={denom.value}
              onClick={() => selectDenomination(denom.value)}
              className={styles.denominationButton}
              whileHover={{ scale: 1.1, backgroundColor: "#b3d7ff" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {denom.value.toLocaleString()}đ
            </motion.button>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <lable> Amount to top-up: </lable>
          <div className={styles.inputWithUnit}>
            <input
              className={styles.inputLabel}
              type="text"
              value={balance}
              onChange={handleBalanceChange}
              placeholder="Enter amount..."
            />
            <span className={styles.unit}>VND</span>
          </div>
        </div>

        <motion.button
          className={styles.button}
          onClick={handleRecharge}
          disabled={isLoading}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 4px 15px rgba(0, 123, 255, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <span className={styles.loader}></span>
          ) : (
            "Top-up via VNPay"
          )}
        </motion.button>
      </motion.div>
  <Transactions accountId={accountId} />

    </div>
  );
}

export default Wallet;
