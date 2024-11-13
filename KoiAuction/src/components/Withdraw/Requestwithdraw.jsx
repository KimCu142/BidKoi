import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { toast } from 'react-toastify'; // Thêm import toast
import api from "../../config/axios";

const WithdrawRequestForm = ({ accountId, accountBalance, closeModal }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const { amount, accountNumber, accountName, bankName } = values;

        // Kiểm tra số tiền rút phải nhỏ hơn hoặc bằng số dư tài khoản
        if (parseFloat(amount) > parseFloat(accountBalance)) {
            alert('Amount exceeds account balance. Please enter a valid amount.');
            return;
        }

        const requestBody = {
            amount,
            accountNumber,
            accountName,
            bankName,
        };

        try {
            const response = await api.post(`/wallet/request-withdraw/${accountId}`, requestBody);
            console.log('Request successful:', response.data);

            // Hiển thị thông báo thành công
            toast.success('Withdraw request submitted successfully!');

            // Gọi hàm đóng modal sau khi gửi request thành công
            closeModal();

        } catch (error) {
            console.error('Error:', error);
            // Hiển thị thông báo lỗi nếu có lỗi xảy ra
            toast.error('An error occurred while submitting the request. Please try again.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
         
        >
            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    { required: true, message: 'Please enter an amount!' },
                    {
                        validator: (_, value) => {
                            if (!value || parseFloat(value) <= parseFloat(accountBalance)) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Amount exceeds account balance.'));
                        },
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true, message: 'Please enter your account number!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Account Name"
                name="accountName"
                rules={[{ required: true, message: 'Please enter your account name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Bank Name"
                name="bankName"
                rules={[{ required: true, message: 'Please enter your bank name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Request</Button>
            </Form.Item>
        </Form>
    );
};

export default WithdrawRequestForm;
