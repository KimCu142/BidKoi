import {
  DatePicker,
  Form,
  Image,
  Input,
  // EyeInvisibleOutlined,
  // EyeTwoTone,
} from "antd";
import styles from "./profile.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import axios from "axios"; //Gọi API
import moment from "moment"; //Chuyển đổi ngày tháng, DataPicker hiểu định dạng ngày

// const { Option } = Select; //Định nghĩa Option cho Select

function Profile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "None",
    phone: "",
    address: "",
    email: "",
    birthday: null,
  });

  const [initialData, setInitialData] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  //============================ Cập nhật birthday khi chọn ngày
  const onChange = (date, dateString) => {
    setUserData((prev) => ({ ...prev, birthday: dateString }));
  };

  const [activeTab, setActiveTab] = useState("account");



 // =========================== Gọi API để lấy thông tin người dùng
 const fetchUserData = async () => {
  try {
    const storedUser = localStorage.getItem("user"); 
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const userId = userData.id; // Lấy user ID từ dữ liệu đã lưu

      const response = await axios.get(
        `http://localhost:8080/BidKoi/account/view/${userId}` // Sử dụng user ID trong URL
      );
      setUserData(response.data);
      setInitialData(response.data);
    } else {
      // Xử lý trường hợp không tìm thấy thông tin người dùng trong localStorage
      console.error("User data not found in localStorage");
      // Có thể chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo lỗi
    }
  } catch (error) {
    console.error("Error fetching user data", error);
  }
};
// Sử dụng useEffect để gọi API khi component render lần đầu
useEffect(() => {
  fetchUserData(); // Gọi hàm lấy dữ liệu người dùng khi component được render
}, []); // Mảng rỗng [] để đảm bảo chỉ gọi một lần khi component mount



  // =========================== Gắn API để cập nhật thông tin mới
  const handleUpdate = async () => {
    try {
      const response = await axios.put("");
      setUserData(response.data);
      setInitialData(response.data);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  // ========================== Cập nhật birthday khi nhập ngày

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleReset = () => {
    setUserData(initialData);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setUserData(initialData);
  };

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
              <Form className={styles.profileContainer}>
                <div className={styles.imageFields}>
                  <Form.Item>
                    <Image
                      width={280}
                      height={280}
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                    <div className={styles.textlight}>
                      Allowed JPG, GIF or PNG.
                    </div>
                  </Form.Item>
                </div>

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
                  </Form.Item>
                  <Form.Item>
                    <label className={styles.formLabel}>Gender</label>
                    {/* <Select
                      placeholder="Select gender"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                      disabled={!isEdit}
                    >
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                      <Option value="Khác">Khác</Option>
                      <Option value="None">None</Option>
                    </Select> */}
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
                      value={
                        userData.birthday ? moment(userData.birthday) : null
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
                          <div className={styles.btn1} onClick={handleUpdate}>
                            Save changes
                          </div>
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
                  <label className={styles.formLabel}>
                    Confirm New Password
                  </label>
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
