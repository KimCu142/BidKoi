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
    <Layout>
      <Sider width={250} className={styles.sidebar}>
        <ul className={styles.sidebarMenu}>
          {role === "BIDDER" && (
            <>
              <li>
                <Link to="/profile" className={styles.link}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/password" className={styles.link}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link to="/bidder-activities" className={styles.link}>
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}

          {role === "STAFF" && (
            <>
              <li>
                <Link to="/profile" className={styles.link}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/password" className={styles.link}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link to="/staff-activities" className={styles.link}>
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}

          {role === "BREEDER" && (
            <>
              <li>
                <Link to="/profile" className={styles.link}>
                  <span className="las la-user" /> <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/password" className={styles.link}>
                  <span className="las la-lock" /> <span>Password</span>
                </Link>
              </li>
              <li>
                <Link to="/breeder-activities" className={styles.link}>
                  <span className="las la-fish" /> <span>Activities</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content className={styles.mainBox}>
          <Outlet /> {/* Đây là nơi các trang con sẽ được render */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
