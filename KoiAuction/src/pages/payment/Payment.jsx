import React, { useState } from "react";
import api from "../../config/axios";
import styles from "./index.module.scss";

function Payment({ auctionAmount, roomId, vnpUrl }) {
  const paymentAmount = Math.round(auctionAmount * 0.2);

  const handleDeposit = async () => {
    if (vnpUrl) {
      window.location.href = vnpUrl;
    } else {
      console.error("Deposit error");
    }
  };

  return (
    <div>
      <button onClick={handleDeposit} className={styles.paymentButton}>
        Pay {paymentAmount} VNĐ
      </button>
      <p className={styles.participationInfo}>
        Get in the game! Your participation fee is just 20% of the initial bid
        price
      </p>
    </div>
  );
}

export default Payment;

// Kiểm tra số dư và thực hiện giao dịch
//   const handleBalance = async () => {
//     try {
//       const response = await api.post("", { accountId, auctionAmount });

//       if (response.status === 200) {
//         setMessage(response.data);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 402) {
//         setNeededMoney(error.response.data.neededMoney);
//         setMessage("Insufficient balance. Please add more funds.");
//       }
//     }
//   };

//   const handleDeposit = async () => {
//     try {
//       const response = await api.post("", { accountId, amount: neededMoney });
//       window.location.href = response.data.paymentUrl;
//     } catch (error) {
//       console.error("Deposit error:", error);
//       setMessage("Có lỗi xảy ra khi nạp tiền.");
//     }
//   };

// const handleDeposit = async () => {
//   try {
//     // Thay thế URL mẫu VNPAY Sandbox ở đây
//     const vnpaySandboxUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${
//       paymentAmount * 100
//     }&vnp_TmnCode=2QXUI4J4&vnp_TxnRef=${Date.now()}&vnp_OrderInfo=Test+Payment&vnp_ReturnUrl=http://localhost:5173/payment-success?roomId=${roomId}&vnp_Version=2.1.0&vnp_Command=pay&vnp_CurrCode=VND&vnp_Locale=vn`;

//     // Chuyển hướng trực tiếp đến VNPAY
//     window.location.href = vnpaySandboxUrl;
//   } catch (error) {
//     console.error("Deposit error:", error);
//   }
// };
