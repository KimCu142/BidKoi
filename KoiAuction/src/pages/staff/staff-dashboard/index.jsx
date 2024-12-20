import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  ToTopOutlined,
  UserOutlined,
  DollarCircleOutlined, // Thêm biểu tượng mới cho lựa chọn Confirm Withdraw
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
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

  // Cập nhật danh sách items để thêm mục "Confirm Withdraw"
  const items = [
    getItem("Koi Request", "staff-request", <TeamOutlined />),
    getItem("Manage Auction", "create-auction", <ToTopOutlined />),
    getItem("Confirm Withdraw", "confirm-withdraw", <DollarCircleOutlined />), // Mục mới
  ];

  // Handle Menu item click
  const onMenuClick = (e) => {
    if (e.key === "create-auction/main") {
      navigate("/staff-dashboard/create-auction");
    } else {
      navigate(`/staff-dashboard/${e.key}`);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            background: colorBgContainer,
          }}
        >
          <h2>Staff Dashboard</h2>
          <Button type="link" onClick={handleBackToHome}>
            Back to Home
          </Button>
        </Header>
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
