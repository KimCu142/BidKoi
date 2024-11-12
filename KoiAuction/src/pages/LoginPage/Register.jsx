import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Tooltip, message } from "antd";
import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css"; // Importing CSS module

const RegisterForm = () => {
  const navigate = useNavigate(); // Hook useNavigate to navigate

  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/BidKoi/account/register",
        {
          username,
          password,
          email,
          phone,
        }
      );

      const data = response.data;

      if (data) {
        message.success("Registration successful!");
        navigate("/login"); // Navigate to login page after successful registration
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Extract error code and message from API response
        const errorMessage = error.response.data.message;
        message.error(`Registration failed : ${errorMessage}`);
        console.error("Registration error:", error.response.data);
      } else {
        message.error("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className={styles.loginpage}>
      <div className={styles.formContainer}>
        <div className={styles.col1}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/LoginPic.jpg?alt=media&token=ab8ea944-6265-4c30-b561-01db2b816095"
            alt="Koi Fish"
            className={styles.image}
          />
        </div>

        <div className={`${styles.col2} ${styles.glass2}`}>
          <p className={styles.loginWords}>Create an Account!</p>
          <form
            className={`${styles.loginForm} ${styles.glass}`}
            onSubmit={handleRegister}
          >
            {/* Username Input */}
            <Input
              placeholder="Enter your username"
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              required
              className={styles.formItem} // Using the CSS module class
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "500px", height: "48px" }} // Adjust size to match Login
              suffix={
                <Tooltip title="Ngọc Thảo xin chào cả nhà :> !">
                  <InfoCircleOutlined
                    style={{
                      color: "rgba(0,0,0,.45)",
                    }}
                  />
                </Tooltip>
              }
            />

            <br />
            <br />

            {/* Email Input */}
            <Input
              placeholder="Enter your email"
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              required
              type="email"
              className={styles.formItem} // Using the CSS module class
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "500px", height: "48px" }} // Adjust size to match Login
            />

            <br />
            <br />

            {/* Phone Number Input */}
            <Input
              placeholder="Enter your phone number"
              prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              required
              type="tel"
              className={styles.formItem} // Using the CSS module class
              value={phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ width: "500px", height: "48px" }} // Adjust size to match Login
            />

            <br />
            <br />

            {/* Password inputs with visibility toggle */}
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                required
                className={styles.formItem} // Using the CSS module class
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "500px", height: "48px" }} // Adjust size to match Login
              />
              <Input.Password
                placeholder="Confirm your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                required
                className={styles.formItem} // Using the CSS module class
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "500px", height: "48px" }} // Adjust size to match Login
              />
            </Space>
            <br />
            <br />

            {/* Register Button */}
            <Button
              type="primary"
              block
              htmlType="submit"
              className={styles.formItem}
            >
              Register
            </Button>
          </form>

          <p className={styles.registerLink}>
            Already have an account?{" "}
            <span
              className={styles.registerLinkText}
              onClick={() => navigate("/Login")} // Navigate to Login page
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
};

export default Register;
