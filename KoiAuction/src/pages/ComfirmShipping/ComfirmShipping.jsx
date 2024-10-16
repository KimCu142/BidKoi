import React, { useState } from 'react';
import "./ComfirmShipping.css";
import KoiCard from '../../components/KoiCard/KoiCard';
import { Form, Image, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';

export default function ComfirmShipping() {
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');

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
        <div className="Page">
            <KoiCard/>
            <div className="card2">
                <div className="status">
                    <span>Status: </span><span className="status-text">Waiting for shipping</span>
                </div>
                <div className="ship-info">
                    <h3>Ship Information</h3>
                    <div className="info-row">
                        <span>Address</span>
                        <span>123 Tran Hung Dao</span>
                        <span>Shipping time</span>
                        <span>13 - 10 - 2024 19:14 PM</span>
                    </div>
                    <div className="info-row">
                        <span>Phone Number</span>
                        <span>+84 123456789</span>
                    </div>
                    <div className="info-row">
                        <span>Full Name</span>
                        <span>Nguyen Van A</span>
                    </div>

                    <div className="image-fields">
                        <Form.Item name="koiImage">
                            <h3 className="avatar-title">Confirm image before Shipping</h3>
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Koi Image"
                                    style={{ width: "280px", height: "auto" }}
                                />
                            ) : (
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length === 0 ? uploadButton : null}
                                </Upload>
                            )}
                            <div className="text-light2">
                                Allowed JPG, GIF or PNG.
                            </div>
                        </Form.Item>
                    </div>
                </div>
            </div>
        </div>
    );
}
