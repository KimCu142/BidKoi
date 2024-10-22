import React, { useState } from 'react';
import { Form, Input, Image, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import './ShippingInfo.css'; // Import CSS file

const ShippingInfo = ({ breeder }) => {
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [form] = Form.useForm(); // Tạo form để quản lý state của các input

    const handlePreview = async file => {
        setPreviewImage(file.thumbUrl || file.preview);
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <div className="card3">
                <Form form={form} className="form">
                    <div className='Ship-title'>Ship Information</div>

                    <div className="info-row">
                        <div className="label2">Address</div>
                        <Form.Item name="address">
                            <Input placeholder="Enter shipping address" />
                        </Form.Item>
                    </div>

                    <div className="info-row">
                        <div className="label2">Phone Number</div>
                        <Form.Item name="phoneNumber">
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </div>

                    <div className="info-row">
                        <div className="label2">Full Name</div>
                        <Form.Item name="fullName">
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </div>


                </Form>
                <div className='Breeder-title'>Breeder Info</div>
                <div className="image-fields">
                  
                    <div className="Breeder-detail">
                        <div className="info-row2">
                            <span>Name</span>
                            <span>KFC</span> {/* Đây là tên của breeder */}
                        </div>
                        <div className="info-row2">
                            <span>Hotline</span>
                            <span>19006886</span> {/* Đây là số điện thoại của breeder */}
                        </div>
                        <div className="info-row2">
                            <span>Email</span>
                            <span>nguyenvana@example.com</span> {/* Đây là email của breeder */}
                        </div>

                    </div>

                </div>
                <div className="status">
                    <span>Status: </span><span className="status-text">Repair for Shipping</span>
                </div>
            </div>
        </>
    );
};

export default ShippingInfo;
