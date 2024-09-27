import { Link } from "react-router-dom";
import "./home.scss";
import KoiLogo from "../../logo/koi_logo";
function HomePage() {
  return (
    <div className="app">
      <div className="container">
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-container">
              <div className="hero-content">
                <div className="hero-header">
                  <div className="logo-container">
                    <img
                      src="src\assets\breeders-transparent.png"
                      alt="Koi Breeders"
                      className="logo"
                    />
                    <div className="title-container">
                      <svg className="site-logo">
                        <g>
                       <KoiLogo/>
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
                      <Link to="/" className="btn1">
                        Register
                      </Link>
                      <Link to="/" className="btn2">
                        View Auctions
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ---------------------------------- */}
         
     
          </section>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
