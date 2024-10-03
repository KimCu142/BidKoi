/* eslint-disable no-unused-vars */
import { DatePicker, Form, Image, Input, Upload } from "antd";
import styles from "./profile.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment"; //Chuyển đổi ngày tháng, DataPicker hiểu định dạng ngày
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/file";

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
  const [activeTab, setActiveTab] = useState("account");
  const [userId, setuserId] = useState("");


  const apiView = "http://localhost:8080/BidKoi/account/view";
  const apiUpdate = "http://localhost:8080/BidKoi/account/update-profile";

 

  // =========================== Gọi API để lấy thông tin người dùng
  const fetchUserData = useCallback(async () => {
    const source = axios.CancelToken.source();
  
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(storedUser);

  
        const response = await axios.get(`${apiView}/${userId}`, {
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
  }, [apiView]);
  



  // useEffect(() => {
  //   const storedUserData = localStorage.getItem("userData");
  //   if (storedUserData) {
  //     setUserData(JSON.parse(storedUserData));
  //     setInitialData(JSON.parse(storedUserData));
  //     setPreviewImage(JSON.parse(storedUserData).avatar || "");
  //   } else {
  //     fetchUserData();
  //   }
  // }, [fetchUserData]);

  useEffect(() => { 
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      const UserData = JSON.parse(storedUser); // Parse the JSON string
      setuserId(UserData.id); // Set userId from parsed data
    }
  
    fetchUserData();
  }, [fetchUserData]);
  


  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    console.log("Hàm handleUpdate được gọi");
    try {
      const storedUser = localStorage.getItem("user");
      setIsUpdate(true);

      let updatedData = { ...userData };

      if (fileList.length > 0) {
        const file = fileList[0];
        const url = await uploadFile(file.originFileObj);
        updatedData = { ...updatedData, avatar: url };
        setPreviewImage(url);
      }

      // const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const UserData = JSON.parse(storedUser);
      const userId = UserData.id;

      console.log("Dữ liệu trước khi gửi:", updatedData);

      const response = await axios.put(`${apiUpdate}/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response from update API: ", response.data);
      toast.success("Update successfully!");

      localStorage.setItem("userData", JSON.stringify(response.data));

      setUserData(response.data);
      setInitialData(response.data);
      setPreviewImage(response.data.avatar || "");

      // Gọi lại hàm fetchUserData() và đợi nó hoàn thành

      // await fetchUserData();
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
  // ===========================================================

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    const tabContent = document.getElementById(tab);
    if (tabContent) {
      tabContent.scrollIntoView({ behavior: "smooth", block: "start" });
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
              <a
                href="#"
                className={activeTab === "account" ? styles.active : ""}
                onClick={() => handleChangeTab("account")}
              >
                <span className="las la-user"></span>
                <span> Account</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === "password" ? styles.active : ""}
                onClick={() => handleChangeTab("password")}
              >
                <span className="las la-lock"></span>
                <span> Password</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeTab === "activities" ? styles.active : ""}
                onClick={() => handleChangeTab("activities")}
              >
                <span className="las la-fish"></span>
                <span> Activities</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <main className={styles.mainBox}>
        {/*============= Nội dung của tab Account ====================*/}

        {activeTab === "account" && (
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
                    <Image
                      src={previewImage}
                      alt="Avatar"
                      style={{ width: "280px", height: "auto" }}
                    />
                  ) : (
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      disabled={!isEdit}
                    >
                      {fileList.length == 0 && isEdit ? uploadButton : null}
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
                    value={userData.phone}
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
                    value={userData.email}
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
        )}

        {activeTab === "password" && (
          <div className={styles.passwordBox}>
            <Form className={styles.passwordContainer}>
              <Form.Item>
                <label className={styles.formLabel}>Current Password</label>
                <Input.Password placeholder="Input current password" />
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>New Password</label>
                <Input.Password placeholder="Input new password" />
              </Form.Item>
              <Form.Item>
                <label className={styles.formLabel}>Confirm New Password</label>
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
            </Form>
          </div>
        )}


        {activeTab === "activities" && (
          <div className="activitiesBox">
            <p>Activity content goes here</p>
          </div>
        )}
      </main>

    </>

  );
}

export default Profile;
