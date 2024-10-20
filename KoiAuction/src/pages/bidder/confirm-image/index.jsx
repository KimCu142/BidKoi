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

function BidderConfirmImg() {
  const [koi, setKoi] = useState([]);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false); // Trạng thái kiểm tra đã upload hay chưa
  const [imageUrl, setImageUrl] = useState("");

  const fetchImageData = async () => {
    try {
      const response = await api.get(
        "https://66f83af72a683ce9730f0194.mockapi.io/confirmShipping"
      );
      console.log("Response data:", response.data);
      if (response.data.length > 0 && response.data[0].img) {
        setImageUrl(response.data[0].img);
        setUploaded(true);
      }
    } catch (error) {
      console.error("Failed to fetch image data:", error);
    }
  };

  const handleSubmit = async (koi) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const confirmUrl = await uploadBidderFile(file.originFileObj);
      koi.img = confirmUrl;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "https://66f83af72a683ce9730f0194.mockapi.io/confirmShipping",
        koi,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageUrl(koi.img);
      setUploaded(true);
      toast.success("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageData();
  }, []);

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
    <div className={styles.Page}>
      <KoiCard />
      <div className={styles.card2}>
        <div className={styles.status}>
          <span>Status: </span>
          <span className={styles.statusText}>Waiting for shipping</span>
        </div>
        <div className={styles.shipInfo}>
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
              <h3 className={styles.avatarTitle}>
                Confirm image before Shipping
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
          </Form>
        </div>
      </div>
    </div>
  );
}

export default BidderConfirmImg;
