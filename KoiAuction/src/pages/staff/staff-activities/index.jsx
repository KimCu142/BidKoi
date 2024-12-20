import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

function StaffActivities() {
  const [koiList, setKoiList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const response = await api.get(`/shipping`);
        setKoiList(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchKoiList();
  }, []);

  const handleKoiClick = (shippingId) => {
    navigate(`/profile/staff/koi-details/${shippingId}`);
  };

  return (
    <>
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

export default StaffActivities;
