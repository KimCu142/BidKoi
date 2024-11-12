import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

function Password() {
  const [form] = useForm();

  const user = JSON.parse(localStorage.getItem("user"));
  const accountId =
    user?.bidder?.account?.id ||
    user?.staff?.account?.id ||
    user?.breeder?.account?.id;

  const onFinish = async (values) => {
    try {
      const response = await api.post(`/account/update-password/${accountId}`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        form.resetFields();
      } else {
        console.error("Failed to update password");
      }
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "An error occurred while updating password"
      );
    }
  };

  return (
    <>
      <motion.div
        className={styles.mainBox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.profileBox}>
          <div
            style={{
              maxWidth: 600,
              margin: "30px auto",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Update Password
            </h2>
            <Form
              form={form}
              name="update_password"
              onFinish={onFinish}
              layout="vertical"
            >
              {/* Current Password */}
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Current Password"
                />
              </Form.Item>

              {/* New Password */}
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New Password"
                />
              </Form.Item>

              {/* Confirm New Password */}
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm New Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  block
                  style={{
                    backgroundColor: "#4685af",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "24px",
                  }}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Password;
