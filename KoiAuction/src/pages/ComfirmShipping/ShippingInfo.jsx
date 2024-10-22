import React, { useState } from 'react';
import { Form, Input, Button, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import './ShippingInfo.css'; // Import CSS file
import api from '../../config/axios';

const ShippingInfo = ({ breeder, koiId, bidderId }) => {
    const [form] = Form.useForm(); // Tạo form để quản lý state của các input
    const handleSubmit = async (values) => {
        // Gọi API với axios
        try {
            const response = await api.post(
                `/shipping/creation/${koiId}/${bidderId}`,
                {
                    name: values.fullName,
                    address: values.address,
                    phone: values.phoneNumber
                }
            );
            message.success('Shipping info submitted successfully!');
        } catch (error) {
            message.error('Failed to submit shipping info!');
            console.error(error);
        }
    };


    return (
        <>
            <div className="card3">
                <Form form={form} className="form" onFinish={handleSubmit}>
                    <div className='Ship-title'>Ship Information</div>

                    <div className="info-row">
                        <div className="label2">Address</div>
                        <Form.Item name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
                            <Input placeholder="Enter shipping address" />
                        </Form.Item>
                    </div>

                    <div className="info-row">
                        <div className="label2">Phone Number</div>
                        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </div>

                    <div className="info-row">
                        <div className="label2">Full Name</div>
                        <Form.Item name="fullName" rules={[{ required: true, message: 'Please enter your full name!' }]}>
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </div>

                    <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <div className='Breeder-title'>Breeder Info</div>
                <div className="image-fields">
                    <div className="Breeder-detail">
                        <div className="info-row2">
                            <span>Name</span>
                            <span>{breeder?.name || 'N/A'}</span> {/* Đây là tên của breeder */}
                        </div>
                        <div className="info-row2">
                            <span>Hotline</span>
                            <span>{breeder?.account.phone || 'N/A'}</span> {/* Đây là số điện thoại của breeder */}
                        </div>
                        <div className="info-row2">
                            <span>Email</span>
                            <span>{breeder?.account.email || 'N/A'}</span> {/* Đây là email của breeder */}
                        </div>
                    </div>
                </div>
                <div className="status">
                    <span>Status: </span><span className="status-text">Prepare for Shipping</span>
                </div>
            </div>
        </>
    );
};

export default ShippingInfo;
