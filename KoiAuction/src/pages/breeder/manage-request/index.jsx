/* eslint-disable no-unused-vars */
import {
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Progress,
  Rate,
  Row,
  Select,
  Table,
  Tooltip,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./index.module.scss";
import uploadFile from "../../../utils/file";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../config/firebase";
import api from "../../../config/axios";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";

function BreederRequest() {
  const [kois, setKois] = useState([]);
  const [breeders, setBreeders] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]); // pload file ảnh
  const [videoFileList, setVideoFileList] = useState([]); // upload file video
  const [uploadProgress, setUploadProgress] = useState(0); // Phần trăm upload
  const [methodInfoVisible, setMethodInfoVisible] = useState(false);
  const [breederId, setBreederId] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Stored User:", userData);
      setBreeders(userData.breeder.name);
      setBreederId(userData.breeder.breederID);
      console.log("Breeder Name:", userData.breeder.name);
    }
  }, []);

  const fetchKoiAndBreeder = async () => {
    try {
      // Fetch thông tin koi
      const koiResponse = await api.get(`/koi`);
      setKois(koiResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchKoiAndBreeder();
  }, []);

  const getJapaneseAge = (age) => {
    age = Number(age);

    const baseLabel = [
      "To",
      "Ni",
      "San",
      "Yon",
      "Go",
      "Roku",
      "Nana",
      "Hachi",
      "Kyu",
      "Jyu",
    ];
    return age >= 1 && age <= 10 ? `${baseLabel[age - 1]}sai` : `${age}y`;
  };

  const statusColors = {
    PENDING: "#d9d9d9", // Trạng thái Pending
    ACCEPTED: "#52c41a", // Trạng thái Approve
    REJECTED: "#ff4d4f",
  };

  const columns = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: statusColors[status],
            border: "1px solid #d9d9d9",
          }}
        />
      ),
    },
    {
      title: "Koi Id",
      dataIndex: "koiId",
      key: "koiId",
    },
    {
      title: "Koi Name",
      dataIndex: "varieties",
      key: "varieties",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <Image src={image} alt="" width={115}></Image>;
      },
    },
    {
      title: "Initial price",
      dataIndex: "initialPrice",
      key: "initialPrice",
      render: (price) => `${price.toLocaleString()} VNĐ`, // Định dạng số với dấu chấm
    },

    {
      title: "Detail",
      key: "detail",
      render: (text, record) => (
        <Button
          style={{
            backgroundColor: "#4685af",
            color: "white",
            fontWeight: "500",
          }}
          type="link"
          onClick={() => {
            Modal.info({
              title: "Koi Details",
              content: (
                <div>
                  <p>
                    <strong>ID:</strong> {record.koiId}
                  </p>
                  <p>
                    <strong>Varieties:</strong> {record.varieties}
                  </p>
                  <p>
                    <strong>Length:</strong> {record.length} cm
                  </p>
                  <p>
                    <strong>Sex:</strong> {record.sex}
                  </p>
                  <p>
                    <strong>Age:</strong> {getJapaneseAge(record.age)} (
                    {record.age}y)
                  </p>
                  <p>
                    <strong>Breeder:</strong>{" "}
                    {record.breeder?.name || breeders.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {record.description}
                  </p>
                  <p>
                    <strong>Initial Price:</strong>{" "}
                    {record.initialPrice.toLocaleString()} VNĐ
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    <Rate disabled value={record.rating} />
                  </p>
                  <Image src={record.image} alt="Koi Image" width={115} />
                  <video src={record.video} controls width={230}></video>
                </div>
              ),
              onOk() {},
            });
          }}
        >
          Detail
        </Button>
      ),
    },
    {
      title: "Actions",
      dataIndex: "status",
      key: "actions",
      render: (status, koiRequest) => {
        if (status === "PENDING") {
          return (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">
                    <Button
                      type="link"
                      style={{ fontWeight: "600" }}
                      onClick={() => {
                        setOpenModal(true);
                        form.setFieldsValue(koiRequest);
                      }}
                    >
                      Edit
                    </Button>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Popconfirm
                      title="Delete"
                      description="Do you want to delete this request?"
                      onConfirm={() => handleDelete(koiRequest.koiId)}
                    >
                      <Button type="link" danger style={{ fontWeight: "600" }}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <EllipsisOutlined style={{ fontSize: "24px" }} />
            </Dropdown>
          );
        } else {
          return (
            <div style={{ color: statusColors[status], fontWeight: "700" }}>
              {status === "ACCEPTED" ? "Approved" : "Rejected"}
            </div>
          );
        }
      },
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //DELETE
  const handleDelete = async (koiId) => {
    try {
      await api.delete(`/koi/del/${koiId}`);
      toast.success("Successfully delete!");
      fetchKoiAndBreeder();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  //CREATE OR UPDATE
  const handleSubmitKoi = async (kois) => {
    kois.status = "PENDING";

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

      switch (kois.rating) {
        case "1 star":
          kois.rating = "1";
          break;
        case "2 stars":
          kois.rating = "2";
          break;
        case "3 stars":
          kois.rating = "3";
          break;
        case "4 stars":
          kois.rating = "4";
          break;
        case "5 stars":
          kois.rating = "5";
          break;
      }

      if (kois.koiId) {
        // => update
        const response = await api.put(`/koi/update/${kois.koiId}`, kois);
        toast.success("Update Koi request sucessfully!");
      } else {
        // => create
        const response = await api.post(`/koi/creation/${breederId}`, kois);
        toast.success("Create Koi request sucessfully!");
      }

      await fetchKoiAndBreeder();
      setOpenModal(false);
      form.resetFields();
      setUploadProgress(0);
    } catch (err) {
      toast.error("Create fail");
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
          setUploadProgress(Math.floor(progress));
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
            <Form.Item name="status" initialValue={0} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              label="KoiID"
              name="koiId"
              hidden
              // rules={[
              //   {
              //     required: true,
              //     message: "Please enter KoiID",
              //   },
              // ]}
            >
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
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message:
                    "Koi's varieties cannot contain numbers or special characters",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Breeder" name="breeder" initialValue={breeders}>
              <Input
                value={breeders} // Nếu breeder chưa được tải, mặc định là chuỗi rỗng
                disabled
              />
            </Form.Item>
            <Form.Item
              label="Length"
              name="length"
              rules={[
                {
                  required: true,
                  message: "Please enter Koi's Length",
                },
                {
                  pattern: /^[0-9]+$/,
                  message:
                    "Length must be a number and cannot contain letters or special characters",
                },
              ]}
            >
              <Input addonAfter="cm" />
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
              <Select placeholder="Select sex">
                <Option value="Female">Female</Option>
                <Option value="Male">Male</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
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
              <Select placeholder="Select age">
                {Array.from({ length: 10 }, (_, i) => (
                  <Select.Option key={i + 1} value={i + 1}>
                    {getJapaneseAge(i + 1)} ({i + 1}y)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter description",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Initial price"
              name="initialPrice"
              rules={[
                {
                  required: true,
                  message: "Please enter initialPrice",
                },
                {
                  pattern: /^[0-9]+$/,
                  message:
                    "Price must be a number and cannot contain letters or special characters",
                },
              ]}
            >
              <Input addonAfter="VNĐ" />
            </Form.Item>
          </div>
          <div className={styles.koiDetail}>
            <h2 className={styles.koiTitle}>Details Information</h2>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Image"
                  name="image"
                  rules={[{ required: true, message: "Please upload 1 image" }]}
                >
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
                <Form.Item
                  label="Video"
                  name="video"
                  rules={[{ required: true, message: "Please upload 1 video" }]}
                >
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={videoFileList}
                    onPreview={handlePreview}
                    onChange={handleVideoChange}
                    accept="video/*"
                    beforeUpload={(file) => {
                      const isLt50M = file.size / 1024 / 1024 < 20; // Giới hạn dung lượng file là 50MB
                      if (!isLt50M) {
                        toast.error("File must be smaller than 50MB!");
                      }
                      return isLt50M; // Chặn upload nếu vượt quá giới hạn
                    }}
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
          <div className={styles.koiStar}>
            <h2
              className={styles.koiTitle}
              style={{
                display: "inline-block",
                marginRight: "8px",
              }}
            >
              Rating
            </h2>

            <Form.Item
              name="rating"
              rules={[{ required: true, message: "Please select rating" }]}
            >
              <Select
                placeholder="Select rating"
                style={{ width: "100%", marginTop: "24px" }}
                onChange={(value) => form.setFieldsValue({ method: value })}
              >
                <Option value={1}>1 star</Option>
                <Option value={2}>2 stars</Option>
                <Option value={3}>3 stars</Option>
                <Option value={4}>4 stars</Option>
                <Option value={5}>5 stars</Option>
              </Select>
            </Form.Item>
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
