import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";

function StaffActivities() {
  const [koiList, setKoiList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const response = await api.get(
          "https://66f83af72a683ce9730f0194.mockapi.io/koiWinning"
        );
        setKoiList(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchKoiList();
  }, []);

  const handleKoiClick = (koiId) => {
    navigate(`/koi-details/${koiId}`);
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebarMenu}>
          <ul>
            <li>
              <Link to="/Profile" className={styles.active}>
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
              <Link to="/bidder-activities" className={styles.active}>
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
                <img
                  src={koi.imageUrl}
                  //   alt={koi.name}
                  className={styles.koiImage}
                />
                <div>
                  <h3>{koi.name}</h3>
                  <p>{koi.date}</p>
                  <p>Bidding price: ${koi.price}</p>
                </div>
              </div>
              <button
                className={styles.confirmBtn}
                onClick={() => handleKoiClick(koi.id)} // Tắt nút nếu đã xác nhận
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

export default StaffActivities;
