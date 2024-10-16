/* eslint-disable no-unused-vars */
import { Avatar, DatePicker, Form, Image, Input, Upload } from "antd";
import styles from "./profile.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment"; //Chuyển đổi ngày tháng, DataPicker hiểu định dạng ngày
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/file";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import uploadAvatarFile from "../../utils/avatarFile";

function Profile() {
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [tempFileList, setTempFileList] = useState([]); //tạo file tạm thời
  const [activeTab, setActiveTab] = useState("account");
  const [userId, setuserId] = useState("");

  // const apiView = "http://localhost:8080/BidKoi/account/view";
  const apiUpdate = "http://localhost:8080/BidKoi/account/update-profile";

  // =========================== Gọi API để lấy thông tin người dùng
  const fetchUserData = useCallback(async () => {
    const source = axios.CancelToken.source();

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(storedUser);
        const userId = userData.sub; // Lấy userId từ trường sub trong userData

        if (userId) {
          const response = await api.get(`/account/view/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          });

          if (response.data) {
            setUserData(response.data);
            setInitialData(response.data);
            setPreviewImage(response.data.avatar || "");
            console.log("Fetched User Data after update: ", response.data);
          }
        } else {
          console.error("userId không tồn tại");
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error("Error fetching user data", error);
      }
    }

    return () => {
      source.cancel("Component unmounted, request canceled.");
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const UserData = JSON.parse(storedUser); // Parse the JSON string
      const userId = UserData.sub; // Lấy userId từ trường sub
      if (userId) {
        setuserId(userId); // Set userId từ parsed data
      } else {
        console.error("Không tìm thấy userId trong user");
      }
    } else {
      console.error("User không tồn tại trong localStorage");
    }

    fetchUserData();
  }, [fetchUserData]);

  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    console.log("Hàm handleUpdate được gọi");
    try {
      const storedUser = localStorage.getItem("user");
      setIsUpdate(true);

      let updatedData = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        gender: userData.gender,
        phone: userData.account?.phone || null,
        email: userData.account?.email || null,
        address: userData.address,
        birthday: userData.birthday,
      };

      if (fileList.length > 0) {
        const avatarFile = fileList[0];
        const avatarUrl = await uploadAvatarFile(avatarFile.originFileObj);
        updatedData = { ...updatedData, avatar: avatarUrl };
        setFileList(tempFileList);
      }

      const token = localStorage.getItem("token");
      const UserData = JSON.parse(storedUser);

      console.log("Dữ liệu trước khi gửi:", userId);

      const response = await axios.put(`${apiUpdate}/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response from update API: ", response.data);
      toast.success("Update successfully!");

      localStorage.setItem("userData", JSON.stringify(response.data));

      // Update local state with the response data
      setUserData(response.data);
      setInitialData(response.data);
      setPreviewImage(response.data.avatar || "");

      // Fetch updated data from API to ensure state consistency
      await fetchUserData();

      console.log("User Data after fetched: ", userData);
      setIsEdit(false);
    } catch (error) {
      console.error(
        "Error updating user data",
        error.response ? error.response.data : error
      );
      toast.error("Error updating user data");
    } finally {
      setIsUpdate(false);
    }
  };

  //============================ Cập nhật birthday khi chọn ngày
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
    setTempFileList(fileList);
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
    setPreviewOpen(true);
  };

  const handleTempChange = ({ fileList: newFileList }) => {
    setTempFileList(newFileList);
  };

  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
              <Link to="/Profile" className={styles.active}>
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
              <Link to="/Activities" className={styles.active}>
                <span className="las la-fish"></span>
                <span> Activities</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.mainBox}>
        <div className={styles.profileBox}>
          <div className={styles.userId}>
            <strong>User ID: </strong>
            {userId}
          </div>
          <Form className={styles.profileContainer}>
            <div className={styles.imageFields}>
              <Form.Item name="avatar">
                <h3 className={styles.avatarTitle}>Avatar</h3>
                {previewImage && !isEdit ? (
                  // Nếu đã có ảnh và không ở chế độ chỉnh sửa, hiển thị ảnh
                  <Image
                    src={fileList[0].url || userData.avatar}
                    alt="Avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={tempFileList}
                    onPreview={handlePreview}
                    onChange={handleTempChange}
                    disabled={!isEdit} // Ngăn chỉnh sửa khi không ở chế độ Edit
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%", // Khung tròn
                      border: "1px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isEdit ? "pointer" : "not-allowed", // Chuột không được phép khi chưa bật Edit
                    }}
                  >
                    {tempFileList.length === 0 && !previewImage && (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#ccc",
                          borderRadius: "50%",
                        }}
                      >
                        Upload
                      </div>
                    )}
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
                ></Input>
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Phone number</label>
                <Input
                  placeholder="Phone number"
                  value={userData.account?.phone}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      phone: e.target.value,
                    })
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
                  value={userData.account?.email}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      email: e.target.value,
                    })
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

export default Profile;
