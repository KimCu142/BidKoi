import { Link } from "react-router-dom";
import "./home.scss";
import KoiLogo from "../../components/logo/koi_logo";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext";
import BreederLogo from "../../components/breederLogo";

function HomePage() {
  const { isLoggedIn, userRole } = useContext(AuthContext);

  return (
    <>
      <div className="app">
        <div className="container">
          <main className="main-content">
            <section className="hero-section">
              <div className="hero-container">
                <div className="hero-content">
                  <div className="hero-header">
                    <div className="logo-container">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_transparent%2Fbreeders-transparent.png?alt=media&token=0b816f8f-d917-4630-b216-085ccb45817c"
                        alt="Koi Breeders"
                        className="logo"
                      />
                      <div className="title-container">
                        <svg className="site-logo">
                          <g>
                            <KoiLogo />
                          </g>
                        </svg>
                        <h1 className="site-title">BIDKOI</h1>
                        <p className="site-tagline">.COM</p>
                      </div>
                    </div>
                    <h1 className="hero-title">
                      Your direct connection to the top{" "}
                      <span className="highlight">Japanese</span> koi breeders
                    </h1>
                    <div className="button-container">
                      <div className="button-group">
                        {!isLoggedIn ? (
                          <>
                            <Link to="/register" className="btn1">
                              Register
                            </Link>
                            <Link to="/" className="btn2">
                              View Auctions
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to={
                                userRole === "BIDDER"
                                  ? "/auctionschedule"
                                  : userRole === "BREEDER"
                                  ? "/breeder-dashboard"
                                  : userRole === "STAFF"
                                  ? "/staff-dashboard"
                                  : "/admin-dashboard"
                              }
                              className={
                                userRole === "BIDDER"
                                  ? "btn-view-auction"
                                  : userRole === "BREEDER"
                                  ? "btn-send-request"
                                  : userRole === "STAFF"
                                  ? "btn-view-request"
                                  : "btn-admin-dashboard"
                              }
                            >
                              {userRole === "BIDDER"
                                ? "View Auctions"
                                : userRole === "BREEDER"
                                ? "Send Request"
                                : userRole === "STAFF"
                                ? "View Request"
                                : "Dashboard"}
                            </Link>
                            <Link to="/about" className="btn-learn-more">
                              Learn More
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BreederLogo />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default HomePage;
