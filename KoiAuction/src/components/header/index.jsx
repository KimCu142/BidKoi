import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import { useState, useEffect } from "react";
import { Button, Dropdown, message, Space } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
  
    console.log("click", e);
  };

  const handleLogout = () => {
    console.log("Log out rui nha");
    localStorage.removeItem("token"); // Xóa token
    localStorage.removeItem("user"); // Xóa thông tin người dùng
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    setUsername(""); 
    navigate('/'); 
    message.info("Logout rùi nha");
  };

  const items = [
    {
      label: "Profile",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'), 
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
    { name: "Auctions", path: "/availableaution", icon: "majesticons--megaphone-line" },
    {
      name: "Profile",
      path: "/Profile",
      icon: "majesticons--question-circle-line",
    },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(userData.username);
    }
  }, []);

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
                  className={`nav-button ${
                    location.pathname === page.path ? "active" : ""
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
                    className={`log-button ${
                      location.pathname === "/login" ? "active" : ""
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`reg-button ${
                      location.pathname === "/register" ? "active" : ""
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
