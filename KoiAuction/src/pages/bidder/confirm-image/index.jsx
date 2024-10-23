/* eslint-disable no-unused-vars */
import KoiCard from "../../../components/KoiCard/KoiCard";
import { Upload, Image, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import uploadBidderFile from "../../../utils/bidderFile";
import { useForm } from "antd/es/form/Form";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

function BidderConfirmImg() {
  const [koi, setKoi] = useState([]);
  const [breederId, setBreederId] = useState([]);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false); // Trạng thái kiểm tra đã upload hay chưa
  const [imageUrl, setImageUrl] = useState("");
  const { shippingId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setBreederId(userData.bidder.id);
    }
  }, []);

  const fetchImageData = async () => {
    try {
      const response = await api.get(`/shipping/${shippingId}`);
      if (response.data.length > 0) {
        const koiData = response.data[0]; // Lấy phần tử đầu tiên từ mảng
        setKoi(koiData); // Đặt dữ liệu vào state koi
        console.log("Response data:", koiData);

        if (koiData.imgBidder) {
          setImageUrl(koiData.imgBidder);
          setUploaded(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch image data:", error);
    }
  };

  const handleSubmit = async () => {
    let confirmUrl = imageUrl;

    if (fileList.length > 0) {
      const file = fileList[0];
      confirmUrl = await uploadBidderFile(file.originFileObj);
    }

    try {
      setLoading(true);

      const response = await api.patch(
        `/shipping/bidder/${shippingId}`,
        confirmUrl,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 204) {
        toast.success("Upload successful");
        setImageUrl(confirmUrl);
        setUploaded(true);
      } else {
        console.error("Failed to save image:", response.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shippingId) {
      fetchImageData();
    }
  }, [shippingId]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

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
          animate={{ scale: 1, rotate: 0 }} // Hiệu ứng mượt khi hình con cá vào đúng vị trí
          whileHover={{ scale: 1.1, rotate: 5 }} // Hiệu ứng khi hover: to hơn và xoay nhẹ
        >
          <img className={styles.KoiImg} src={koi.koi.image} alt="Koi image" />
        </motion.div>
      ) : (
        <p>No image available</p>
      )}
      <motion.div
        className={styles.card}
        initial={{ y: 50, opacity: 0 }} // Từ dưới lên với opacity
        animate={{ y: 0, opacity: 1 }} // Lên vị trí với opacity đầy đủ
        transition={{ delay: 0.3, duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      >
        <div className={styles.status}>
          <motion.span
            initial={{ x: -50, opacity: 0 }} // Text vào từ trái
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Status: {koi.status}
          </motion.span>
          <span className={styles.statusText}>Waiting for shipping</span>
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
            <span>Shipping time</span>
            <span>{koi.date}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Phone Number</span>
            <span>{koi.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Full Name</span>
            <span>{koi.name}</span>
          </div>
          <Form form={form} onFinish={handleSubmit}>
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
                {uploaded ? (
                  <Image
                    // wrapperStyle={{
                    //   display: "none",
                    // }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={imageUrl}
                  />
                ) : (
                  <Form.Item>
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      disabled={uploaded} // ko cho chỉnh sửa
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                )}
                {!uploaded && (
                  <div className={styles.textLight2}>Allowed JPG, PNG.</div>
                )}
              </div>
              {!uploaded && (
                <Button
                  type="primary"
                  className={styles.sendButton}
                  loading={loading}
                  htmlType="submit"
                >
                  Send
                </Button>
              )}
            </div>
          </Form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default BidderConfirmImg;
