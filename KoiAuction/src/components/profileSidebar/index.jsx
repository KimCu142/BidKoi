// SidebarLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Layout } from "antd";
import styles from "./index.module.scss";

const { Sider, Content } = Layout;

const SidebarLayout = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <div>
      <div width={250} className={styles.sidebar}>
        <ul className={styles.sidebarMenu}>
          {role === "BIDDER" && (
            <>
              <li>
                <Link to="/profile" className={styles.active}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/password" className={styles.active}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/bidder-activities" className={styles.active}>
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}

          {role === "STAFF" && (
            <>
              <li>
                <Link to="/profile" className={styles.active}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/password" className={styles.active}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/staff-activities" className={styles.active}>
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}

          {role === "BREEDER" && (
            <>
              <li>
                <Link to="/profile" className={styles.active}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/password" className={styles.active}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/breeder-activities"
                  className={styles.active}
                >
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SidebarLayout;
