import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";

function BreederActivities() {
  const [breederId, setBreederId] = useState([]);
  const [koiList, setKoiList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setBreederId(userData.breeder.breederID);
    }
  }, []);

  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const response = await api.get(`/shipping/breeder/${breederId}`);
        setKoiList(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchKoiList();
  }, [breederId]);

  const handleKoiClick = (shippingId) => {
    navigate(`/breeder/koi-details/${shippingId}`);
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebarMenu}>
          <ul>
            <li>
              <Link to="/profile" className={styles.active}>
                <span className="las la-user"></span>
                <span> Account</span>
              </Link>
            </li>
            <li>
              <Link to="/Password" className={styles.active}>
                <span className="las la-lock"></span>
                <span> Password</span>
              </Link>
            </li>
            <li>
              <Link to="/breeder-activities" className={styles.active}>
                <span className="las la-fish"></span>
                <span> Activities</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.mainBox}>
        <div className={styles.koiList}>
          {koiList.map((koi, index) => (
            <motion.div
              key={index}
              className={styles.koiItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{
                y: -5,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.1 },
              }}
            >
              <div className={styles.koiInfo}>
                <img src={koi.koi.image} className={styles.koiImage} />
                <div>
                  <h3>
                    Bidder name: {koi.bidder.firstname} {koi.bidder.lastname}
                  </h3>
                  <p>{koi.date}</p>
                  <p>
                    Breeder: {koi.koi.breeder.name} {"-"} {koi.koi.varieties}
                  </p>
                  <p>Final bidding price: ${koi.koi.finalPrice}</p>
                </div>
              </div>
              <button
                className={styles.confirmBtn}
                onClick={() => handleKoiClick(koi.shippingId)}
              >
                Confirm
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BreederActivities;
