import { useEffect, useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function BreederPayment({ koiRequestAmount, handlePayment }) {
  const paymentAmount = Math.round(koiRequestAmount);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [breederId, setBreederId] = useState(null);
  const [accountId, setAccountId] = useState(null);

  const fetchWalletBalance = async () => {
    try {
      console.log("Account ID: " + accountId);
      const response = await api.get(`/wallet/view/${accountId}`);
      const { data } = response;

      if (data) {
        console.log("Balance: ", data.balance);
        setWalletBalance(data.balance);
      } else {
        console.error("Unable to retrieve wallet information.");
      }
    } catch (error) {
      console.error("Error fetching wallet information via API:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setBreederId(userData.breeder.breederID);
      setAccountId(userData.breeder.account.id);
    }
  }, []);

  useEffect(() => {
    console.log("Updated Breeder ID:", breederId);
    console.log("Updated Account ID:", accountId);
  }, [breederId, accountId]);

  useEffect(() => {
    // Fetch wallet information when accountId and breederId are available
    if (accountId && breederId) {
      fetchWalletBalance();
    }
  }, [accountId, breederId]);

  const handleCreateKoiRequest = async () => {
    if (walletBalance < paymentAmount) {
      console.log("Current balance:", walletBalance);
      toast.error("Your balance is insufficient. Please top up to proceed.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/breeder/request-koi/${breederId}`, {
        fee: paymentAmount,
      });

      if (response.status === 200) {
        console.log("Koi auction request created successfully and payment has been deducted.");
        toast.success("Auction request payment has been created successfully!");
        handlePayment();
      } else {
        console.error("An error occurred while creating the Koi auction request.");
      }
    } catch (error) {
      console.error("Error while calling the API:", error);
      toast.error("An error occurred while creating the Koi auction request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateKoiRequest}
        className={styles.paymentButton}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : `Pay ${paymentAmount.toLocaleString()} VND to create Koi Request`}
      </button>
      <p className={styles.participationInfo}>
        Please note: Creating a Koi request will deduct the specified amount
        from your wallet.
      </p>
    </div>
  );
}

BreederPayment.propTypes = {
  koiRequestAmount: PropTypes.number.isRequired,
  handlePayment: PropTypes.func.isRequired,
};

export default BreederPayment;