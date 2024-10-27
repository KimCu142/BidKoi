/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  ToTopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const StaffDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate(); // Hook for navigation

  const fetchAuctions = async () => {
    try {
      const response = await api.get("/auction");
      setAuctions(response.data);
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const items = [
    getItem("Koi Request", "staff-request", <TeamOutlined />),
    getItem("Manage Auction", "create-auction", <ToTopOutlined />),
  ];

  // Handle Menu item click
  const onMenuClick = (e) => {
    if (e.key === "create-auction/main") {
      navigate("/staff-dashboard/create-auction");
    } else {
      navigate(`/staff-dashboard/${e.key}`);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={220}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["request"]}
          mode="inline"
          items={items}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default StaffDashboard;
