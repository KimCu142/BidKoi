/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import styles from "./index.module.scss";
import { Button, Form, Input, Popconfirm, Select } from "antd";
import { useParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";

function StaffConfirm() {
  const [koi, setKoi] = useState([]);
  const [staffId, setStaffId] = useState([]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [refundTarget, setRefundTarget] = useState("bidder");
  const [deliveryStatus, setDeliveryStatus] = useState("success");
  const [uploaded, setUploaded] = useState(false);
  const [reason, setReason] = useState("");
  const { shippingId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setStaffId(userData.staff?.staffId || userData.koi?.staff?.staffId);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/shipping/${shippingId}`);
      if (response.data.length > 0) {
        const koiData = response.data[0];
        setKoi(koiData);
        console.log("Response data:", koiData);

        if (koiData.description === "Successful delivery") {
          setDeliveryStatus("success");
          setReason("");
          setRefundTarget("bidder");
          setUploaded(true); // Đã xác nhận thành công
        } else if (koiData.description) {
          setDeliveryStatus("fail");
          setReason(koiData.description);
          setRefundTarget(koiData.refundTarget || "");
          setUploaded(true);
        } else {
          setUploaded(false); // Nếu chưa có dữ liệu xác nhận
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    if (shippingId) {
      fetchData();
    }
  }, [shippingId]);

  //Xóa lý do nếu giao thành công
  const handleConfirmChange = (value) => {
    console.log("Confirm Shipping changed to:", value); // Thêm dòng này
    setDeliveryStatus(value);

    if (value === "success") {
      setRefundTarget("bidder"); // Mặc định refund cho bidder nếu thành công
      setReason(""); // Xóa lý do nếu giao thành công
      console.log("Reason cleared:", reason); // Thêm dòng này để kiểm tra lý do có bị xóa không
    } else {
      setRefundTarget(""); // Cho phép người dùng chọn khi không thành công
    }
  };

  const handleReasonChange = (e) => setReason(e.target.value);
  const handleRefundTargetChange = (value) => setRefundTarget(value);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        confirm:
          refundTarget === "breeder" ? "Refund to breeder" : "Refund to bidder",
        des: deliveryStatus === "success" ? "Successful delivery" : reason,
      };

      const response = await api.patch(
        `/shipping/staff/${staffId}/${shippingId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 204) {
        toast.success("Confirmation sent successfully");
        setUploaded(true);

        // Refund based on refundTarget
        const rollbackUrl =
          refundTarget === "bidder"
            ? `/transaction/rollback/${koi.bidder.id}/${koi.koi.koiId}`
            : `/transaction/rollbackToBreeder/${koi.koi.koiId}`;

        const depositAmount = koi.koi.initialPrice * 0.2;

        const refundResponse = await api.put(rollbackUrl, {
          amount: depositAmount,
          description: "Refund deposit",
          type: "REFUND",
          status: "COMPLETED",
        });

        if (refundResponse.status === 204) {
          toast.success(
            `Refund processed successfully to ${
              refundTarget === "breeder" ? "Breeder" : "Bidder"
            }`
          );
        } else {
          console.error("Failed to process refund:", refundResponse.data);
        }

        // await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchData();
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
        // style={{ height: "700px", overflow: "auto" }}
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
        <div className={styles.customerScrollbar}>
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
                label={
                  <span style={{ fontSize: "18px" }}>Confirm Shipping</span>
                }
                style={{ marginTop: "16px" }}
              >
                <Select
                  placeholder="Choose delivery status"
                  onChange={handleConfirmChange}
                  value={deliveryStatus}
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
              {deliveryStatus === "fail" && (
                <Form.Item
                  label={<span style={{ fontSize: "18px" }}>Reason</span>}
                >
                  <Input.TextArea
                    placeholder="Enter reason"
                    value={reason}
                    onChange={handleReasonChange}
                    rows={3}
                    disabled={uploaded}
                  />
                </Form.Item>
              )}

              <Form.Item
                label={<span style={{ fontSize: "18px" }}>Refund Target</span>}
                style={{ marginTop: "16px" }}
              >
                <Select
                  placeholder="Select refund target"
                  onChange={handleRefundTargetChange}
                  value={refundTarget}
                  disabled={deliveryStatus === "success" || uploaded} // Khóa khi thành công hoặc đã upload
                  style={{ backgroundColor: "#f0f0f0" }}
                  dropdownStyle={{ fontSize: "16px" }}
                >
                  <Select.Option
                    value="breeder"
                    style={{ fontSize: "16px", color: "#000" }}
                  >
                    Refund to Breeder
                  </Select.Option>
                  <Select.Option
                    value="bidder"
                    style={{ fontSize: "16px", color: "#000" }}
                  >
                    Refund to Bidder
                  </Select.Option>
                </Select>
              </Form.Item>

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
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StaffConfirm;
