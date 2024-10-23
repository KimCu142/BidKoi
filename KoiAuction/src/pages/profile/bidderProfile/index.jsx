/* eslint-disable no-unused-vars */
import { DatePicker, Form, Image, Input, Upload } from "antd";
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

// Thay đổi đường dẫn tùy vào vị trí của utils/file

function BidderProfile({ accountId, token }) {
  const [userData, setUserData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    gender: "None",
    phone: "",
    address: "",
    email: "",
    birthday: null,
    avatar: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [errors, setErrors] = useState({});

  // =========================== Gọi API để lấy thông tin người dùng
  const fetchUserData = useCallback(async () => {
    try {
      if (token) {
        const response = await api.get(`/account/profile/${accountId}`);

        if (response.data) {
          const userInfo = response.data;
          const accountInfo = userInfo.account;

          // Cập nhật userData từ cả userInfo và accountInfo
          setUserData({
            id: userInfo.id || "",
            firstname: userInfo.firstname || "",
            lastname: userInfo.lastname || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            birthday: userInfo.birthday
              ? moment.utc(userInfo.birthday).format("YYYY-MM-DD")
              : null,
            avatar: userInfo.avatar || "",
          });

          // Lưu lại giá trị ban đầu để dùng sau này
          setInitialData({
            id: userInfo.id || "",
            firstname: userInfo.firstname || "",
            lastname: userInfo.lastname || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            birthday: userInfo.birthday
              ? moment.utc(userInfo.birthday).format("YYYY-MM-DD")
              : null,
            avatar: userInfo.avatar || "",
          });

          setPreviewImage(userInfo.avatar || "");
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

  const validate = () => {
    let formErrors = {};

    if (!/^[A-Za-z\s]+$/.test(userData.firstname)) {
      formErrors.firstname =
        "First name must not contain numbers or special characters";
    }

    if (!/^[A-Za-z\s]+$/.test(userData.lastname)) {
      formErrors.lastname =
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

      if (userData.birthday) {
        updatedData.birthday = moment(userData.birthday).format("YYYY-MM-DD");
      }

      // Kiểm tra nếu có file trong fileList để upload avatar
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          // Nếu file là mới (từ input), upload logo mới
          try {
            const url = await uploadAvatarFile(file.originFileObj);
            updatedData = { ...updatedData, avatar: url }; // Thêm URL mới vào data
            setPreviewImage(url);
          } catch (uploadError) {
            console.error("Error uploading avatar", uploadError);
            toast.error("Error uploading avatar. Please try again!");
            return;
          }
        } else {
          // Nếu file không có originFileObj (tức là ảnh cũ), giữ nguyên URL cũ
          updatedData = { ...updatedData, avatar: file.url };
        }
      }

      // Gửi yêu cầu cập nhật dữ liệu người dùng
      const response = await api.put(
        `/account/update-profile/${accountId}`,
        updatedData
      );

      toast.success("Update successfully!");

      // Cập nhật dữ liệu người dùng sau khi lưu thành công
      await fetchUserData();
      setIsEdit(false);

      setTimeout(() => {
        setIsUpdate(false); // Kết thúc loading sau 1 giây
      }, 1000);
    } catch (error) {
      console.error("Error updating user data", error);
    } finally {
      setIsUpdate(false);
      setFileList([]); // Reset danh sách file sau khi cập nhật
    }
  };

  // const onChange = (date, dateString) => {
  //   setUserData((prev) => ({
  //     ...prev,
  //     birthday: dateString
  //       ? moment(dateString, "YYYY-MM-DD").format("YYYY-MM-DD")
  //       : null,
  //   }));
  // };

  const onChange = (date, dateString) => {
    setUserData((prev) => ({
      ...prev,
      birthday: date ? dateString : null, // Sử dụng dateString trực tiếp mà không qua moment
    }));
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
    setErrors({});
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserData(initialData);
    setErrors({});
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
              <Link to="/bidder-activities" className={styles.active}>
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
            <div className={styles.imageFields}>
              <Form.Item name="avatar">
                <label className={styles.avatarTitle}>Your avatar</label>
                {previewImage && !isEdit ? (
                  <Image
                    src={previewImage}
                    alt="Avatar"
                    style={{
                      width: "200px",
                      height: "220px",
                      borderRadius: "50%",
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
                {isEdit && (
                  <div className={styles.textlight}>
                    Allowed JPG, GIF or PNG.
                  </div>
                )}
              </Form.Item>
            </div>

            <div className={styles.formFields}>
              <Form.Item>
                <label className={styles.formLabel}>First name</label>
                <Input
                  placeholder="First name"
                  value={userData.firstname}
                  onChange={(e) =>
                    setUserData({ ...userData, firstname: e.target.value })
                  }
                  disabled={!isEdit}
                />
                {errors.firstname && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.firstname}
                  </span>
                )}
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Last name</label>
                <Input
                  placeholder="Last name"
                  value={userData.lastname}
                  onChange={(e) =>
                    setUserData({ ...userData, lastname: e.target.value })
                  }
                  disabled={!isEdit}
                />
                {errors.lastname && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.lastname}
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
                <label className={styles.formLabel}>Birthday</label>
                {/* <DatePicker
                  onChange={onChange}
                  value={
                    userData.birthday
                      ? moment(userData.birthday, "YYYY-MM-DD")
                      : null
                  }
                  disabled={!isEdit}
                  className={styles.birthdayDatepicker}
                /> */}
                <DatePicker
                  onChange={onChange}
                  value={
                    userData.birthday
                      ? moment(userData.birthday, "YYYY-MM-DD")
                      : null
                  }
                  disabled={!isEdit}
                  className={styles.birthdayDatepicker}
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

export default BidderProfile;
