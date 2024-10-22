/* eslint-disable no-unused-vars */
import { DatePicker, Form, Image, Input, Upload } from "antd";
import styles from "./index.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";
import uploadLogoFile from "../../../utils/logoFile";
import SpinImage from "../../../components/spin/spin";

// Thay đổi đường dẫn tùy vào vị trí của utils/file

function BreederProfile({ accountId, token }) {
  const [userData, setUserData] = useState({
    breederID: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    logo: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  // =========================== Gọi API để lấy thông tin người dùng
  const fetchUserData = useCallback(async () => {
    try {
      if (token) {
        const response = await api.get(`/breeder/profile/${accountId}`);

        if (response.data) {
          const userInfo = response.data;
          const accountInfo = userInfo.account;

          // Cập nhật userData từ cả userInfo và accountInfo
          setUserData({
            breederID: userInfo.id || "",
            name: userInfo.name || "",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            logo: userInfo.logo || "",
          });

          // Lưu lại giá trị ban đầu để dùng sau này
          setInitialData({
            breederID: userInfo.id || "",
            name: userInfo.name || "",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            logo: userInfo.logo || "",
          });

          setPreviewImage(userInfo.logo || "");
        }
      } else {
        console.error("Error: Empty token!");
      }
    } catch (error) {
      console.error("Error fetching user data", error.message);
    }
  }, [accountId, token]);

  useEffect(() => {
    if (accountId) {
      fetchUserData();
    }
  }, [fetchUserData, accountId]);

  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    try {
      setIsUpdate(true);
      let updatedData = { ...userData };

      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          // Nếu file là mới (từ input), upload logo mới
          try {
            const url = await uploadLogoFile(file.originFileObj);
            updatedData = { ...updatedData, logo: url }; // Thêm URL mới vào data
            setPreviewImage(url);
          } catch (uploadError) {
            console.error("Error uploading logo", uploadError);
            toast.error("Error uploading logo. Please try again!");
            return;
          }
        } else {
          // Nếu file không có originFileObj (tức là ảnh cũ), giữ nguyên URL cũ
          updatedData = { ...updatedData, logo: file.url };
        }
      }

      // Gửi yêu cầu cập nhật dữ liệu người dùng
      const response = await api.put(
        `/breeder/update-profile/${accountId}`,
        updatedData
      );

      toast.success("Update successfully!");

      await fetchUserData();
      setIsEdit(false);

      setTimeout(() => {
        setIsUpdate(false); // Kết thúc loading sau 1 giây
      }, 1000);
    } catch (error) {
      console.error("Error updating user data", error);
      toast.error("Error updating user data");
    } finally {
      setIsUpdate(false);
      setFileList([]);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);

    if (previewImage && fileList.length === 0) {
      setFileList([
        {
          uid: Date.now(), // Sử dụng thời gian hiện tại để tạo UID
          name: previewImage.split("/").pop(), // Lấy tên file từ URL
          status: "done",
          url: previewImage, // Dùng previewImage thay vì hard-code URL
        },
      ]);
    }
  };

  const handleReset = () => {
    setUserData(initialData);
    setPreviewImage(initialData.avatar);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserData(initialData);
  };

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

      <motion.div
        className={styles.mainBox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.profileBox}>
          {/* <div className={styles.userId}>
            <strong>User ID: </strong>
            {accountId}
          </div> */}
          <Form className={styles.profileContainer}>
            <div className={styles.formFields}>
              <Form.Item name="logo">
                <div className={styles.logoContainer}>
                  <label className={styles.avatarTitle}>Logo</label>
                  {previewImage && !isEdit ? (
                    <Image
                      src={previewImage}
                      alt="Logo"
                      style={{
                        width: "150px",
                        height: "150px",
                        // borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-circle"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      disabled={!isEdit}
                      beforeUpload={() => false}
                    >
                      {fileList.length === 0 && isEdit ? uploadButton : null}
                    </Upload>
                  )}
                </div>
                {isEdit && (
                  <div className={styles.textlight}>
                    Allowed JPG, GIF or PNG.
                  </div>
                )}
              </Form.Item>
              <Form.Item className={styles.addressFields}>
                <label className={styles.formLabel}>Address</label>
                <TextArea
                  placeholder="Address"
                  value={userData.address}
                  rows={3}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  disabled={!isEdit}
                />
              </Form.Item>
              <Form.Item>
                <Form.Item>
                  <label className={styles.formLabel}>Breeder name</label>
                  <Input
                    placeholder="Name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    disabled={!isEdit}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Phone number</label>
                <Input
                  placeholder="Phone number"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  disabled={!isEdit}
                />
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Email</label>
                <Input
                  placeholder="Email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  disabled={!isEdit}
                />
              </Form.Item>

              <div className={styles.profileButton}>
                <div className={styles.twoButton}>
                  {isEdit ? (
                    <>
                      <motion.button
                        className={styles.btn1}
                        onClick={handleUpdate}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, y: -10 }}
                      >
                        Save changes
                      </motion.button>

                      <div onClick={handleReset} className={styles.btn2}>
                        Reset
                      </div>
                    </>
                  ) : (
                    <div className={styles.btn1} onClick={handleEdit}>
                      Edit
                    </div>
                  )}
                  <div className={styles.btn2} onClick={handleCancel}>
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </motion.div>
      {/* Loading Spinner */}
      {isUpdate && (
        <div className={styles.loadingOverlay}>
          {/* Sử dụng component spinner của bạn */}
          <SpinImage />
        </div>
      )}
    </>
  );
}

export default BreederProfile;
