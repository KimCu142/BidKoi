import { useEffect, useState } from "react";

import styles from "./profile.module.scss";
import BidderProfile from "../bidderProfile";
import StaffProfile from "../staffProfile";
import BreederProfile from "../breederProfile";

function Profile() {
  const [userData, setUserData] = useState("");
  const [role, setRole] = useState("");
  // const [token, setToken] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    // const storedToken = localStorage.getItem("token");

    if (storedUser) {
      setUserData(JSON.parse(storedUser));

      // Kiểm tra và thiết lập role
      if (storedRole) {
        setRole(storedRole);
      } else if (userData.role) {
        setRole(userData.role);
      }

      // Thiết lập userId và token
      // setAccountId(userData.accountId || "");
      // setToken(storedToken);
    }
  }, []);

  return (
    <div className={styles.profileContainer}>
      {role === "BIDDER" && (
        <BidderProfile
          accountId={userData.bidder?.account?.id}
          token={userData.token}
        />
      )}
      {role === "STAFF" && (
        <StaffProfile
          accountId={userData.staff?.account?.id}
          token={userData.token}
        />
      )}
      {role === "BREEDER" && (
        <BreederProfile
          accountId={userData.breeder?.account?.id}
          token={userData.token}
        />
      )}
    </div>
  );
}

export default Profile;
