/* eslint-disable no-unused-vars */
import { DatePicker, Form, Image, Input, Select, Upload } from "antd";
import styles from "./index.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import uploadAvatarFile from "../../../utils/avatarFile";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import { motion } from "framer-motion";
const { Option } = Select;

// Thay đổi đường dẫn tùy vào vị trí của utils/file

function StaffProfile({ accountId, token }) {
  const [userData, setUserData] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    gender: "None",
    phone: "",
    address: "",
    email: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [errors, setErrors] = useState({});

  // =========================== Gọi API để lấy thông tin người dùng
  const fetchUserData = useCallback(async () => {
    try {
      if (token) {
        const response = await api.get(`/staff/profile/${accountId}`);

        if (response.data) {
          const userInfo = response.data;
          const accountInfo = userInfo.account;

          // Cập nhật userData từ cả userInfo và accountInfo
          setUserData({
            staffId: userInfo.staffId || "",
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
          });

          // Lưu lại giá trị ban đầu để dùng sau này
          setInitialData({
            staffId: userInfo.staffId || "",
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
          });

          //   setPreviewImage(userInfo.avatar || "");
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

  // Custom validation function
  const validate = () => {
    let formErrors = {};

    if (!/^[A-Za-z\s]+$/.test(userData.firstName)) {
      formErrors.firstName =
        "First name must not contain numbers or special characters";
    }

    if (!/^[A-Za-z\s]+$/.test(userData.lastName)) {
      formErrors.lastName =
        "Last name must not contain numbers or special characters";
    }

    if (!userData.phone) {
      formErrors.phone = "Phone number is required";
    } else if (!/^[0-9]+$/.test(userData.phone)) {
      formErrors.phone = "Phone number must contain only digits";
    } else if (!userData.phone.match(/^0[0-9]{9}$/)) {
      formErrors.phone =
        "Phone number must be a valid 10-digit number starting with 0";
    }

    if (!/\S+@\S+\.\S+/.test(userData.email)) {
      formErrors.email = "Email is invalid";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please enter correctly before submitting");
      return;
    }

    try {
      setIsUpdate(true);
      let updatedData = { ...userData };

      const response = await api.put(
        `/staff/update-profile/${accountId}`,
        updatedData
      );

      toast.success("Update successfully!");

      // Cập nhật dữ liệu người dùng sau khi lưu thành công
      await fetchUserData();
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating user data", error);
    } finally {
      setIsUpdate(false);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleReset = () => {
    setUserData(initialData);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserData(initialData);
    setErrors({});
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
              <Link to="/password" className={styles.active}>
                <span className="las la-lock"></span>
                <span> Password</span>
              </Link>
            </li>
            <li>
              <Link to="/staff-activities" className={styles.active}>
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
          <Form className={styles.profileContainer} labelCol={{ span: 24 }}>
            <div className={styles.formFields}>
              <Form.Item>
                <label className={styles.formLabel}>First name</label>
                <Input
                  placeholder="First name"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  disabled={!isEdit}
                />
                {errors.firstName && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.firstName}
                  </span>
                )}
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Last name</label>
                <Input
                  placeholder="Last name"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  disabled={!isEdit}
                />
                {errors.lastName && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.lastName}
                  </span>
                )}
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Gender</label>
                <Input
                  placeholder="Gender"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  disabled={!isEdit}
                />
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
                {errors.phone && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.phone}
                  </span>
                )}
              </Form.Item>
              <Form.Item className={styles.addressFields}>
                <label className={styles.formLabel}>Address</label>
                <TextArea
                  placeholder="Address"
                  rows={4}
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
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
                {errors.email && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.email}
                  </span>
                )}
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
    </>
  );
}

export default StaffProfile;
