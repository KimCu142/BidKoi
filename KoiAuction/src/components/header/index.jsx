import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import { useState, useEffect, useContext } from "react";
import { Button, Dropdown, message, Space } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../AuthContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const handleMenuClick = (e) => {
    console.log("click", e);
  };

  const handleLogout = () => {
    logout();
    message.info("Logout thành công");
    navigate("/");
  };

  const items = [
    {
      label: "Profile",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },

    {
      label: "Logout",
      key: "2",
      icon: <UserOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const pages = [
    { name: "Home", path: "/", icon: "majesticons--home-line" },
    {
      name: "Auctions",
      path: "/availableaution",
      icon: "majesticons--megaphone-line",
    },
    {
      name: "About us",
      path: "/about",
      icon: "majesticons--question-circle-line",
    },
  ];




  return (
    <header className="header">
      {/* {`header ${isScroll ? "scroll" : ""}`} */}
      <div className="header-logo">
        <img
          src="https://auctionkoi.com/images/auction_koi_logo.png"
          alt=""
          width={40}
          height={40}
        />
        <h1 className="header__name">BIDKOI</h1>
      </div>
      <nav className="header__nav">
        <ul>
          <div className="nav__left">
            {pages.map((page) => (
              <li key={page.name}>
                <Link
                  to={page.path}
                  className={`nav-button ${location.pathname === page.path ? "active" : ""
                    }`}
                >
                  <span className={`majesticons ${page.icon}`} />
                  <span className="nav__name">{page.name}</span>
                </Link>
              </li>
            ))}
          </div>

          <div className="nav__right">
            {/* Conditional rendering based on isLoggedIn */}
            {isLoggedIn ? (
              <li>
                <div className="Loged-Box">
                  <Dropdown menu={menuProps}>
                    <Button>
                      <Space>
                    
                        <div className="username-display">


                          Welcome, {username}
                        </div>
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`log-button ${location.pathname === "/login" ? "active" : ""
                      }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`reg-button ${location.pathname === "/register" ? "active" : ""
                      }`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
