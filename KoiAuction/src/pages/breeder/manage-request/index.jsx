/* eslint-disable no-unused-vars */
import {
    Button,
    Col,
    Flex,
    Form,
    Image,
    Input,
    message,
    Modal,
    Popconfirm,
    Progress,
    Row,
    Table,
    Upload,
  } from "antd";
  import { useForm } from "antd/es/form/Form";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import { toast } from "react-toastify";
  import styles from "./index.module.scss";
  import uploadFile from "../../../utils/file";
  import { PlusOutlined } from "@ant-design/icons";
  import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
  import { storage } from "../../../config/firebase";
  
  function BreederRequest() {
    const [kois, setKois] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]); // pload file ảnh
    const [videoFileList, setVideoFileList] = useState([]); // upload file video
    const [uploadProgress, setUploadProgress] = useState(0); // Phần trăm upload
  
    const api = "http://localhost:8080/BidKoi/koi";
    const apiP = "http://localhost:8080/BidKoi/koi/create/100";
  
    const fetchKoi = async () => {
      try {
        const response = await axios.get(`${api}`);
        console.log(response.data);
        setKois(response.data);
      } catch (err) {
        toast.error("Failed to fetch Koi data");
      }
    };
  
    useEffect(() => {
      fetchKoi();
    }, []);
  
    const columns = [
      {
        title: "Koi Id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Varieties",
        dataIndex: "varieties",
        key: "varieties",
      },
      {
        title: "Length",
        dataIndex: "length",
        key: "length",
      },
      {
        title: "Sex",
        dataIndex: "sex",
        key: "sex",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Breeder",
        dataIndex: "breeder",
        key: "breeder",
      },
      {
        title: "Intitial price",
        dataIndex: "initialPrice",
        key: "initialPrice",
      },
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (image) => {
          return <Image src={image} alt="" width={120}></Image>;
        },
      },
      {
        title: "Video",
        dataIndex: "video",
        key: "video",
        render: (video) => {
          return (
            <video src={video} type="video/mp4" alt="" width={250} controls />
          );
        },
      },
      {
        title: "Action",
        dataIndex: "id",
        key: "id",
        render: (id, koirequest) => (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpenModal(true);
                form.setFieldsValue(koirequest);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete"
              description="Do you want to delete this request?"
              onConfirm={() => handleDelete(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ];
  
    const handleOpenModal = () => {
      form.resetFields();
      setFileList([]);
      setVideoFileList([]);
      setUploadProgress(0);
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    //DELETE
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${api}/${id}`);
        toast.success("Successfully delete!");
        fetchKoi();
      } catch (err) {
        toast.error(err.response.data);
      }
    };
  
    //CREATE OR UPDATE
    const handleSubmitKoi = async (kois) => {
      try {
        setLoading(true);
  
        if (fileList.length > 0) {
          const file = fileList[0];
          console.log(file);
          const url = await uploadFile(file.originFileObj);
          kois.image = url;
        }
  
        if (videoFileList.length > 0) {
          const videoFile = videoFileList[0].originFileObj;
          const videoUrl = await handleUpload(videoFile, "videos");
          kois.video = videoUrl;
        }
  
        if (kois.id) {
          // => update
          const response = await axios.put(`${api}/${kois.id}`, kois);
        } else {
          // => create
          const response = await axios.post(`${apiP}`, kois);
        }
  
        toast.success("Create Koi request sucessfully!");
        fetchKoi();
        setOpenModal(false);
        form.resetFields();
        setUploadProgress(0);
      } catch (err) {
        toast.err("Create fail");
      } finally {
        setLoading(false);
      }
    };
  
    // Upload tệp lên Firebase
    const handleUpload = (file) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `koi_video/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            setUploadProgress(progress);
          },
          (error) => {
            toast.error("Upload failed");
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              message.success("Upload successful");
              setUploadProgress(0);
              resolve(downloadURL);
            });
          }
        );
      });
    };
  
    //Base64
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
  
    const handleImageChange = ({ fileList: newFileList }) =>
      setFileList(newFileList);
  
    const handleVideoChange = ({ fileList: newFileList }) =>
      setVideoFileList(newFileList);
  
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
      <div>
        <h1>Breeder Request</h1>
        <Button onClick={handleOpenModal}>Create new Koi Request</Button>
        <Table columns={columns} dataSource={kois} />
        <Modal
          confirmLoading={loading}
          onOk={() => form.submit()}
          centered
          open={openModal}
          onCancel={handleCloseModal}
          width={1000}
        >
          <h2 className={styles.koiTitle}>Basic Information</h2>
          <Form form={form} onFinish={handleSubmitKoi} labelCol={{ span: 24 }}>
            <div className={styles.koiInfo}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Koi Varieties"
                name="varieties"
                rules={[
                  {
                    required: true,
                    message: "Please enter Koi's varieties",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Breeder" name="breeder">
                <Input />
              </Form.Item>
              <Form.Item
                label="Length"
                name="length"
                rules={[
                  {
                    required: true,
                    message: "Please enter Koi's Length",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Sex"
                name="sex"
                rules={[
                  {
                    required: true,
                    message: "Please enter Koi's Sex",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Age"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "Please enter Koi's Age",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className={styles.koiDetail}>
              <h2 className={styles.koiTitle}>Details Information</h2>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Image" name="image">
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleImageChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Video" name="video">
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={videoFileList}
                      onPreview={handlePreview}
                      onChange={handleVideoChange}
                      accept="video/*"
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    {uploadProgress > 0 && (
                      <Flex vertical>
                        <Progress
                          percent={uploadProgress}
                          status="active"
                          strokeColor={{
                            from: "#108ee9",
                            to: "#87d068",
                          }}
                        />
                      </Flex>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    );
  }
  
  export default BreederRequest;
  