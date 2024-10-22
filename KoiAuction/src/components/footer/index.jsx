import { Link } from "react-router-dom";
import "./index.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__nav">
        <div className="footer-logo">
          <img
            src="https://auctionkoi.com/images/auction_koi_logo.png"
            alt=""
          />
        </div>

        <ul>
          <h1 className="footer-title">Navigation</h1>
          <li>
            <Link to="/" className="nav-button">
              <span className="majesticons--home-line" />
              <span className="nav__name">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/auctions" className="nav-button">
              <span className="majesticons--megaphone-line" />
              <span className="nav__name">Auctions</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-button">
              <span className="majesticons--question-circle-line" />
              <span className="nav__name">About</span>
            </Link>
          </li>
        </ul>

        <ul>
          <h1 className="footer-title">Policy</h1>
          <li>
            <Link to="/" className="nav-button">
              <span className="majesticons--scan-fingerprint"></span>
              <span className="nav__name">Privacy Policy</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-button">
              <span className="majesticons--document-line"></span>
              <span className="nav__name">Terms and Conditions</span>
            </Link>
          </li>
        </ul>

        <ul>
          <h1 className="footer-title">Account</h1>
          <li>
            <Link to="/login" className="nav-button">
              <span className="majesticons--login-half-circle-line"></span>
              <span className="nav__name">Login</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-button">
              <span className="majesticons--scan-user-line"></span>
              <span className="nav__name">Register</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        BidKoi.com is a division of
        <a href="https://selectkoi.com" className="link">
          SelectKoi.com
        </a>
      </div>
    </footer>
  );
}

export default Footer;
