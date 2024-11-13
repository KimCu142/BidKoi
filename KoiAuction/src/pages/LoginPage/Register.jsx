import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Tooltip, message, Form } from "antd";
import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css"; // Importing CSS module

const RegisterForm = () => {
  const navigate = useNavigate(); // Hook useNavigate to navigate

  // State for form inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (values) => {
    const { username, email, phone, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post(
        "/account/register",
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
          <Form
            className={`${styles.loginForm} ${styles.glass}`}
            onFinish={handleRegister}
            layout="vertical"
            style={{ maxWidth: "540px" }}
          >
            {/* Username Input */}
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username!",
                },
                {
                  min: 8,
                  max: 16,
                  message: "Username must be between 8 and 16 characters!",
                },
              ]}
            >
              <Input
                placeholder="Enter your username"
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                className={styles.formItem} // Using the CSS module class
                suffix={
                  <Tooltip title="Ngọc Thảo xin chào cả nhà :> !">
                    <InfoCircleOutlined
                      style={{
                        color: "rgba(0,0,0,.45)",
                      }}
                    />
                  </Tooltip>
                }
                style={{ width: "500px", height: "48px" }} // Adjust size to match Login
              />
            </Form.Item>

            {/* Email Input */}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input
                placeholder="Enter your email"
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                className={styles.formItem}
                style={{ width: "500px", height: "48px" }}
              />
            </Form.Item>

            {/* Phone Number Input */}
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number!",
                },
                {
                  pattern: /^0\d{9}$/,
                  message: "Phone number must be 10 digits and start with 0!",
                },
              ]}
            >
              <Input
                placeholder="Enter your phone number"
                prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                className={styles.formItem}
                style={{ width: "500px", height: "48px" }}
              />
            </Form.Item>

            {/* Password inputs with visibility toggle */}
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
                {
                  min: 8,
                  max: 32,
                  message: "Password must be between 8 and 32 characters!",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className={styles.formItem}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "500px", height: "48px" }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                {
                  validator: (_, value) =>
                    value === password
                      ? Promise.resolve()
                      : Promise.reject("Passwords do not match!"),
                },
              ]}
            >
              <Input.Password
                placeholder="Confirm your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className={styles.formItem}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "500px", height: "48px" }}
              />
            </Form.Item>

            {/* Register Button */}
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                className={styles.formItem}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <p className={styles.registerLink}>
            Already have an account?{" "}
            <span
              className={styles.registerLinkText}
              onClick={() => navigate("/Login")}
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
