import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

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
      <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
        <h2>Update Password</h2>
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
                min: 6,
                message: "Password must be at least 6 characters",
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
            <Button type="primary" htmlType="submit" block>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Password;
