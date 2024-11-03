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
import { motion } from "framer-motion";
import BreederPayment from "../../payment/BreederPayment";

function BreederRequest() {
  const [kois, setKois] = useState([]);
  const [breeders, setBreeders] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]); // pload file ảnh
  const [videoFileList, setVideoFileList] = useState([]); // upload file video
  const [uploadProgress, setUploadProgress] = useState(0); // Phần trăm upload
  const [methodInfoVisible, setMethodInfoVisible] = useState(false);
  const [breederId, setBreederId] = useState({});
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  
  useEffect(() => { 
    const fetchBreederData = async () => {
      try {
        // Sử dụng accountId từ userData
        const accountId = userData?.breeder?.account?.id;
  
        if (accountId) {
          const response = await api.get(`/breeder/profile/${accountId}`);
          const userData = response.data;
  
          if (userData && userData.name) {
            setBreeders(userData.name);
            setBreederId(userData.breederID);
            console.log("Breeder Name:", userData.name);
          }
        } else {
          console.error("Account ID is not available.");
        }
      } catch (error) {
        console.error("Error fetching breeder data:", error);
      }
    };
  
    fetchBreederData();
  }, [userData]);


  const handlePayment = () => {
    // Thanh toán thành công, tiếp tục submit form
    setIsPaymentModal(false);
    form.submit();
  };

  const handleOk = () => {
    // Nếu là tạo mới (không có selectedKoi), mở Payment Modal
    if (!selectedKoi) {
      form
        .validateFields() // Validate toàn bộ form
        .then((values) => {
          if (values.initialPrice) {
            const numericPrice = parseFloat(
              values.initialPrice.replace(/,/g, "")
            );
            setPaymentAmount(Math.round(numericPrice) * 0.5); // Tính số tiền thanh toán
            setIsPaymentModal(true); // Mở Payment Modal
          }
        })
        .catch((errorInfo) => {
          console.error("Validation Failed:", errorInfo);
          // Không mở Payment Modal nếu có lỗi
        });
    } else {
      // Nếu là chỉnh sửa, submit form luôn
      form.submit();
    }
  };

  const handleCancelPayment = () => {
    setIsPaymentModal(false); // Đóng Payment Modal
  };

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
          type="link"
          style={{ backgroundColor: "#4685af", color: "white" }}
          onClick={() => handleOpenDetailModal(record)}
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
        if (status === "PENDING" || status === "REJECTED") {
          return (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">
                    <Button
                      type="link"
                      style={{ fontWeight: "600" }}
                      onClick={() => handleEditKoi(koiRequest)}
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
              {status === "ACCEPTED" && (
                <div style={{ color: statusColors[status], fontWeight: "700" }}>
                  Approved
                </div>
              )}
            </div>
          );
        }
      },
    },
  ];

  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //Open Create
  const handleOpenCreateModal = () => {
    setSelectedKoi(null);
    form.resetFields();
    setFileList([]);
    setVideoFileList([]);
    setOpenEditModal(true);
  };

  //Open edit
  const handleEditKoi = (koiRequest) => {
    // Tạo một bản sao của `koiRequest` và đặt `status` là "PENDING"
    const koiData = { ...koiRequest, status: "PENDING" };

    // Cập nhật `selectedKoi` và thiết lập giá trị cho form
    setSelectedKoi(koiData);
    form.setFieldsValue({
      ...koiData,
      breeder: koiRequest.breeder.name,
      initialPrice: formatNumber(koiRequest.initialPrice),
    });

    // Đặt lại fileList cho ảnh từ koiRequest
    if (koiRequest.image) {
      setFileList([
        {
          uid: `${Date.now()}-image`,
          name: "image",
          status: "done",
          url: koiRequest.image,
        },
      ]);
    } else {
      setFileList([]);
    }

    // Đặt lại videoFileList cho video từ koiRequest
    if (koiRequest.video) {
      setVideoFileList([
        {
          uid: `${Date.now()}-video`,
          name: "video",
          status: "done",
          url: koiRequest.video,
        },
      ]);
    } else {
      setVideoFileList([]);
    }

    // Mở modal chỉnh sửa
    setOpenEditModal(true);
  };

  //Close edit
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    form.resetFields();
  };

  //Open detail
  const handleOpenDetailModal = (koi) => {
    setSelectedKoi(koi);
    setOpenDetailModal(true);
  };

  //Close detail
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedKoi(null);
  };

  //Input money form

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
    if (selectedKoi && selectedKoi.status === "REJECTED") {
      kois.status = "PENDING";
    } else {
      kois.status = "PENDING"; // Mặc định "PENDING" cho các trường hợp khác
    }

    kois.initialPrice = kois.initialPrice.replace(/,/g, "");
    try {
      setLoading(true);

      // Kiểm tra và upload file ảnh nếu có `originFileObj`
      if (fileList.length > 0) {
        const file = fileList[0];
        const originFile = file.originFileObj;

        if (originFile) {
          const url = await uploadFile(originFile);
          kois.image = url;
        } else {
          // Nếu `originFileObj` không tồn tại, giữ nguyên URL nếu đã có
          kois.image = file.url || "";
          console.warn(
            "File originFileObj is undefined, using existing URL if available."
          );
        }
      }

      // Kiểm tra và upload file video nếu có `originFileObj`
      if (videoFileList.length > 0) {
        const videoFile = videoFileList[0].originFileObj;

        if (videoFile) {
          const videoUrl = await handleUpload(videoFile);
          kois.video = videoUrl;
        } else {
          // Nếu `originFileObj` không tồn tại, giữ nguyên URL nếu đã có
          kois.video = videoFileList[0].url || "";
          console.warn(
            "Video originFileObj is undefined, using existing URL if available."
          );
        }
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
      setOpenEditModal(false);
      form.resetFields();
      setUploadProgress(0);
    } catch (err) {
      console.error("Create request error:", err);
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
      <Button onClick={handleOpenCreateModal}>Create new Koi Request</Button>
      <Table columns={columns} dataSource={kois} />

      {/* Detail Modal */}
      <Modal
        visible={openDetailModal}
        title="Koi Details"
        onCancel={handleCloseDetailModal}
        footer={null}
      >
        {selectedKoi && (
          <div>
            <p>
              <strong>ID:</strong> {selectedKoi.koiId}
            </p>
            <p>
              <strong>Varieties:</strong> {selectedKoi.varieties}
            </p>
            <p>
              <strong>Length:</strong> {selectedKoi.length} cm
            </p>
            <p>
              <strong>Sex:</strong> {selectedKoi.sex}
            </p>
            <p>
              <strong>Age:</strong> {selectedKoi.age} years
            </p>
            <p>
              <strong>Description:</strong> {selectedKoi.description}
            </p>
            <p>
              <strong>Initial Price:</strong> {selectedKoi.initialPrice} VNĐ
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              <Rate disabled value={selectedKoi.rating} />
            </p>
            <Image src={selectedKoi.image} alt="Koi Image" width={115} />
            {selectedKoi.video && (
              <video src={selectedKoi.video} controls width={230}></video>
            )}
          </div>
        )}
      </Modal>

      <Modal
        visible={openEditModal}
        title={selectedKoi ? "Edit Koi" : "Create Koi"}
        onCancel={handleCloseEditModal}
        onOk={handleOk}
        confirmLoading={loading}
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
              <Input value={breeders} disabled />
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
                {
                  validator: (_, value) => {
                    if (value && parseInt(value, 10) > 102) {
                      return Promise.reject("Length cannot exceed 102 cm");
                    }
                    return Promise.resolve();
                  },
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
                  message: "Please enter initial price",
                },
                {
                  pattern: /^[0-9,]+$/,
                  message:
                    "Price must be a number and cannot contain letters or special characters",
                },
              ]}
            >
              <Input
                addonAfter="VNĐ"
                value={form.getFieldValue("initialPrice")}
                onChange={(e) =>
                  form.setFieldsValue({
                    initialPrice: formatNumber(
                      e.target.value.replace(/,/g, "")
                    ),
                  })
                }
                placeholder="Enter amount"
              />
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
                    accept="image/*"
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        toast.error("Please upload an image file only!");
                        return Upload.LIST_IGNORE;
                      }
                      return isImage;
                    }}
                    onRemove={() => setFileList([])}
                  >
                    {fileList.length < 1 ? uploadButton : null}
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
                      const isVideo = file.type.startsWith("video/");
                      const isLt50M = file.size / 1024 / 1024 < 50;

                      if (!isVideo) {
                        toast.error("Please upload a video file only!");
                        return Upload.LIST_IGNORE;
                      }

                      if (!isLt50M) {
                        toast.error("File must be smaller than 50MB!");
                        return Upload.LIST_IGNORE;
                      }

                      return isVideo && isLt50M;
                    }}
                    onRemove={() => setVideoFileList([])}
                  >
                    {videoFileList.length < 1 ? uploadButton : null}
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
        {isPaymentModal && !selectedKoi && (
          <div className={styles.overlay}>
            <motion.div className={styles.paymentBox}>
              <p className={styles.warningText}>
                <div className={styles.bellIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
                    fill="#108ee9"
                  >
                    <path d="M12 2C10.346 2 9 3.346 9 5v.086C6.717 6.598 5 9.134 5 12v4.586L3.293 19.293c-.391.391-.391 1.023 0 1.414.391.391 1.023.391 1.414 0L7 17.414V12c0-2.348 1.37-4.25 3.25-5.067.056.356.131.7.232 1.026C9.707 8.41 8 10.408 8 13v5h8v-5c0-2.592-1.707-4.59-3.482-5.041.101-.326.176-.67.232-1.026C15.63 7.75 17 9.652 17 12v5.414l2.293 2.293c.391.391 1.023.391 1.414 0s.391-1.023 0-1.414L19 16.586V12c0-2.866-1.717-5.402-4-6.914V5c0-1.654-1.346-3-3-3zM12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
                  </svg>
                </div>
                Please pay {paymentAmount.toLocaleString()} VNĐ for Koi request
              </p>
              <BreederPayment
                koiRequestAmount={Math.round(paymentAmount)}
                handlePayment={handlePayment}
              />

              <Button
                className={styles.paymentButton}
                onClick={handleCancelPayment}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
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
