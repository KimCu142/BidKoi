/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import styles from "./index.module.scss";
import { Button, Form, Input, Popconfirm, Select } from "antd";
import { useParams } from "react-router-dom";

function StaffConfirm() {
  const [koi, setKoi] = useState([]);
  const [breederId, setBreederId] = useState([]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [confirmType, setConfirmType] = useState("success");
  const [reason, setReason] = useState("");
  const { shippingId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setBreederId(userData.bidder.id);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/shipping/${shippingId}`);
      if (response.data.length > 0) {
        const koiData = response.data[0];
        setKoi(koiData);
        console.log("Response data:", koiData);

        if (koiData.bidderConfirm === "Successful delivery") {
          setConfirmType("success");
          setReason(""); // Xóa reason khi thành công
        } else {
          setConfirmType("fail");
          setReason(koiData.bidderConfirm); // Đặt lý do nếu không thành công
        }
      }
    } catch (error) {
      console.error("Failed to fetch image data:", error);
    }
  };

  useEffect(() => {
    if (shippingId) {
      fetchData();
    }
  }, [shippingId]);

  //Xóa lý do nếu giao thành công
  const handleConfirmChange = (value) => {
    setConfirmType(value);
    if (value === "success") setReason("");
  };

  const handleReasonChange = (e) => setReason(e.target.value);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        confirm: confirmType === "success" ? "Successful delivery" : reason,
      };

      const response = await api.patch(
        `/shipping/bidder/${shippingId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 204) {
        toast.success("Send successful");
        fetchData();
      } else {
        console.error("Failed to send:", response.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.Page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
    >
      {koi.koi && koi.koi.image ? (
        <motion.div
          className={styles.KoiWrapper}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <img className={styles.KoiImg} src={koi.koi.image} alt="Koi image" />
        </motion.div>
      ) : (
        <p>No image available</p>
      )}
      <motion.div
        className={styles.card}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      >
        <div className={styles.status}>
          <motion.span
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Status: {koi.status}
          </motion.span>
          <span className={styles.statusText}>{koi.bidderConfirm}</span>
        </div>
        <motion.div
          className={styles.shipInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Ship Information</h3>
          <div className={styles.infoRow}>
            <span>Address</span>
            <span>{koi.address}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Phone Number</span>
            <span>{koi.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Full Name</span>
            <span>{koi.name}</span>
          </div>

          <div className={styles.imageFields}>
            <div className={styles.column}>
              <h3 className={styles.avatarTitle}>
                Confirm image before Shipping
              </h3>

              <img src={koi.imgBreeder} />
            </div>
            <div className={styles.column}>
              <h3 className={styles.avatarTitle}>
                Confirm image after Shipping
              </h3>

              <img src={koi.imgBidder} />
            </div>
          </div>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              label={<span style={{ fontSize: "18px" }}>Confirm Shipping</span>}
              style={{ marginTop: "16px" }}
            >
              <Select
                placeholder="Chọn loại xác nhận"
                onChange={handleConfirmChange}
                value={confirmType}
                disabled={uploaded}
                style={{
                  backgroundColor: "#f0f0f0",
                }}
                dropdownStyle={{
                  fontSize: "16px", // Kích thước chữ trong dropdown
                }}
              >
                <Select.Option
                  value="success"
                  style={{ fontSize: "16px", color: "#000" }}
                >
                  Successful delivery
                </Select.Option>
                <Select.Option
                  value="fail"
                  style={{ fontSize: "16px", color: "#000" }}
                >
                  Unsuccessful delivery
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Ô nhập lý do nếu không thành công */}
            {confirmType === "fail" && (
              <Form.Item
                label={<span style={{ fontSize: "18px" }}>Reason</span>}
              >
                <Input.TextArea
                  placeholder="Enter here"
                  value={reason}
                  onChange={handleReasonChange}
                  rows={3}
                  disabled={uploaded}
                />
              </Form.Item>
            )}
            {/* Popconfirm để xác nhận gửi */}
            {!uploaded && (
              <Popconfirm
                title={
                  <div>
                    Are you sure you want to send? <br />
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      You cannot edit after pressing Send.
                    </span>
                  </div>
                }
                onConfirm={form.submit}
                okText="Sure"
                cancelText="Cancel"
              >
                <Button
                  type="primary"
                  className={styles.sendButton}
                  loading={loading}
                >
                  Send
                </Button>
              </Popconfirm>
            )}
          </Form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default StaffConfirm;
