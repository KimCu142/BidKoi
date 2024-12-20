import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";
import { Modal, Button, Pagination } from "antd";
import Invoice from "../../../components/Invoice/Invoice";

function BidderActivities() {
  const [koiList, setKoiList] = useState([]);
  const [bidderId, setBidderId] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const KOIS_PER_PAGE = 3;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setBidderId(userData.bidder.id);
    }
  }, []);

  useEffect(() => {
    const fetchKoiList = async () => {
      try {
        const response = await api.get(`/shipping/bidder/${bidderId}`);
        const sortedKoiList = response.data.sort((a, b) => b.koi.koiId - a.koi.koiId);
        setKoiList(sortedKoiList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if (bidderId) {
      fetchKoiList();
    }
  }, [bidderId]);

  const handleKoiClick = (shippingId) => {
    navigate(`/profile/bidder/koi-details/${shippingId}`);
  };

  const handleInvoiceClick = async (koiId) => {
    try {
      const response = await api.get(`/invoice/view/${koiId}`);
      setInvoiceData(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setInvoiceData(null);
  };

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedKoiList = [...koiList].sort((a, b) => {
      return newSortOrder === "asc" ? a.koi.koiId - b.koi.koiId : b.koi.koiId - a.koi.koiId;
    });
    setKoiList(sortedKoiList);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedKoiList = koiList.slice(
    (currentPage - 1) * KOIS_PER_PAGE,
    currentPage * KOIS_PER_PAGE
  );

  return (
    <>
      <div className={styles.mainBox}>
        <Button onClick={handleSortOrderChange} style={{ marginBottom: "20px" }}>
          Sort by Koi ID ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </Button>
        <div className={styles.koiList}>
          {paginatedKoiList.map((koi, index) => (
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
                  <p>{new Date(koi.date).toLocaleString()}</p>
                  <p>
                    Breeder: {koi.koi.breeder.name} {"-"} {koi.koi.varieties}
                  </p>
                  <p>Final bidding price: ${koi.koi.finalPrice}</p>
                </div>
              </div>
              <div>
                <button
                  className={styles.confirmBtn}
                  onClick={() => handleKoiClick(koi.shippingId)}
                >
                  Confirm
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => handleInvoiceClick(koi.koi.koiId)}
                >
                  View Invoice
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <Pagination
          current={currentPage}
          pageSize={KOIS_PER_PAGE}
          total={koiList.length}
          onChange={handlePageChange}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
        <Modal
          title="Invoice Details"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          style={{ top: 5 }}
          width="50%"
        >
          {invoiceData ? (
            <Invoice {...invoiceData} />
          ) : (
            <div>Loading invoice...</div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default BidderActivities;
