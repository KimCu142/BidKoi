import { useEffect, useState } from "react";

import styles from "./profile.module.scss";
import BidderProfile from "../bidderProfile";

function Profile() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      const userData = JSON.parse(storedUser);

      // Kiểm tra và thiết lập role
      if (storedRole) {
        setRole(storedRole);
      } else if (userData.role) {
        setRole(userData.role);
      }

      // Thiết lập userId và token
      setAccountId(userData.accountId || "");
      setToken(storedToken || "");
    }
  }, []);

  return (
    <div className={styles.profileContainer}>
      {role === "BIDDER" && (
        <BidderProfile accountId={accountId} token={token} />
      )}
      {/* Thêm các Profile cho role khác nếu có */}
    </div>
  );
}

export default Profile;
