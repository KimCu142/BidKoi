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

// Thay đổi đường dẫn tùy vào vị trí của utils/file

function StaffProfile({ accountId, token }) {
  const [userData, setUserData] = useState({
    staffId: "",
    firstname: "",
    lastname: "",
    gender: "None",
    phone: "",
    address: "",
    email: "",
    birthday: null,
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
        const response = await api.get(`/staff/profile/${accountId}`);

        if (response.data) {
          const userInfo = response.data;
          const accountInfo = userInfo.account;

          // Cập nhật userData từ cả userInfo và accountInfo
          setUserData({
            staffId: userInfo.id || "",
            firstname: userInfo.firstname || "",
            lastname: userInfo.lastname || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            birthday: userInfo.birthday || null,
          });

          // Lưu lại giá trị ban đầu để dùng sau này
          setInitialData({
            staffId: userInfo.id || "",
            firstname: userInfo.firstname || "",
            lastname: userInfo.lastname || "",
            gender: userInfo.gender || "None",
            phone: accountInfo.phone || "",
            address: userInfo.address || "",
            email: accountInfo.email || "",
            birthday: userInfo.birthday || null,
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

  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    try {
      setIsUpdate(true);
      let updatedData = { ...userData };

      // Kiểm tra nếu có file trong fileList để upload avatar
      //   if (fileList.length > 0) {
      //     const file = fileList[0];
      //     try {
      //       const url = await uploadAvatarFile(file.originFileObj); // Upload ảnh
      //       updatedData = { ...updatedData, avatar: url }; // Cập nhật URL avatar mới
      //       setPreviewImage(url);
      //     } catch (uploadError) {
      //       console.error("Error uploading avatar", uploadError);
      //       toast.error("Error uploading avatar. Please try again!");
      //       return; // Ngừng quá trình nếu lỗi xảy ra khi upload ảnh
      //     }
      //   }

      // Gửi yêu cầu cập nhật dữ liệu người dùng
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
      toast.error("Error updating user data");
    } finally {
      setIsUpdate(false);
      setFileList([]); // Reset danh sách file sau khi cập nhật
    }
  };

  const onChange = (date, dateString) => {
    setUserData((prev) => ({ ...prev, birthday: dateString }));
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleReset = () => {
    setUserData(initialData);
    setPreviewImage(initialData.avatar);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserData(initialData);
  };

  //   const getBase64 = (file) =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });

  //   const handlePreview = async (file) => {
  //     if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj);
  //     }
  //     setPreviewImage(file.url || file.preview);
  //   };

  //   const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  //   const uploadButton = (
  //     <button
  //       style={{
  //         border: 0,
  //         background: "none",
  //       }}
  //       type="button"
  //     >
  //       <PlusOutlined />
  //       <div
  //         style={{
  //           marginTop: 8,
  //         }}
  //       >
  //         Upload
  //       </div>
  //     </button>
  //   );

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
              <Link to="/staff-activities" className={styles.active}>
                <span className="las la-fish"></span>
                <span> Activities</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.mainBox}>
        <div className={styles.profileBox}>
          {/* <div className={styles.userId}>
            <strong>User ID: </strong>
            {accountId}
          </div> */}
          <Form className={styles.profileContainer}>
            {/* <div className={styles.imageFields}>
              <Form.Item name="avatar">
                <h3 className={styles.avatarTitle}>Avatar</h3>
                {previewImage && !isEdit ? (
                  <Image
                    src={previewImage}
                    alt="Avatar"
                    style={{
                      width: "150px",
                      height: "150px",
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
            </div> */}

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
                <DatePicker
                  onChange={onChange}
                  value={userData.birthday ? moment(userData.birthday) : null}
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
              </Form.Item>

              <div className={styles.profileButton}>
                <div className={styles.twoButton}>
                  {isEdit ? (
                    <>
                      <button className={styles.btn1} onClick={handleUpdate}>
                        Save changes
                      </button>

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
      </div>
    </>
  );
}

export default StaffProfile;
