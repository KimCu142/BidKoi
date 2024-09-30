import { Link, useLocation } from "react-router-dom";
import "./index.scss";
// import { useEffect, useState } from "react";

function Header() {
  // const [isScroll, setIsScroll] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScroll(window.scrollY > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const location = useLocation();

  const pages = [
    { name: "Home", path: "/", icon: "majesticons--home-line" },
    { name: "Auctions", path: "/auction", icon: "majesticons--megaphone-line" },
    {
      name: "Profile",
      path: "/Profile",
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
            <li>
              <Link
                to="/login"
                className={`log-button ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Log in
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
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
