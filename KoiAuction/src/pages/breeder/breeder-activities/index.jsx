import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";
import { Modal } from "antd";
import Invoice from "../../../components/Invoice/Invoice";

function BreederActivities() {
  const [breederId, setBreederId] = useState([]);
  const [koiList, setKoiList] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    if (breederId) {
      fetchKoiList();
    }
  }, [breederId]);

  const handleKoiClick = (shippingId) => {
    navigate(`/profile/breeder/koi-details/${shippingId}`);
  };

  const handleInvoiceClick = async (koiId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/invoice/get/${koiId}`);
      setInvoiceData(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
    setIsLoading(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setInvoiceData(null);
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
                <img src={koi.koi.image} className={styles.koiImage} alt="Koi" />
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
              <div>
                <button
                  className={styles.confirmBtn}
                  onClick={() => handleInvoiceClick(koi.koi.koiId)}
                >
                  Invoice
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => handleKoiClick(koi.shippingId)}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {isLoading && <div>Loading...</div>}
        <Modal
          title="Invoice Details"
          style={{ top: 20 }}
          visible={isModalVisible}
          onCancel={handleModalClose}
          width="50%" // Set the modal width to 90% of the viewport'
        
          bodyStyle={{ maxWidth: '80vw' }} // Ensure the content doesn't exceed 80vw
        
        >
          {invoiceData && <Invoice {...invoiceData} />}
        </Modal>
      </div>
    </>
  );
}

export default BreederActivities;