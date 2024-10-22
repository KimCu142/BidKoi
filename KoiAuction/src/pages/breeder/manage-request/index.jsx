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
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
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
  const [breederid, setBreederid] = useState({});

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setBreeders(userData.breeder.name);
      setBreederid(userData.breeder.breederID);
      console.log(userData.breeder.name);
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
      title: "Varieties",
      dataIndex: "varieties",
      key: "varieties",
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
      render: (length) => `${length} cm`,
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
      render: (age) => {
        const ageLabel = getJapaneseAge(age);
        return (
          <span>
            {ageLabel} ({age}y)
          </span>
        );
      },
    },
    {
      title: "Breeder",
      dataIndex: ["breeder", "name"],
      key: "breeder",
      render: (_, record) => record.breeder?.name || breeders.name,
      // record: đối tượng đại diện cho 1 hàng trong bảng
      // truy cập thuộc tính "breeder" của từng koi
      // Nếu `breeder` tồn tại và có `name`, nó sẽ hiển thị `name`
      // Nếu không, nó sẽ hiển thị tên mặc định từ `breeders` trong state
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Intitial price",
      dataIndex: "initialPrice",
      key: "initialPrice",
      render: (price) => `${price}VNĐ`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => {
        switch (rating) {
          case 1:
            return "1 star";
          case 2:
            return "2 stars";
          case 3:
            return "3 stars";
          case 4:
            return "4 stars";
          case 5:
            return "5 stars";
        }
      },
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
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (video) => {
        return (
          <video src={video} type="video/mp4" alt="" width={230} controls />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "action",
      render: (status, koiRequest) => {
        if (status === "PENDING") {
          return (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setOpenModal(true);
                  form.setFieldsValue(koiRequest);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete"
                description="Do you want to delete this request?"
                onConfirm={() => handleDelete(koiRequest.koiId)}
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
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
        case "1":
          kois.rating = "1 star";
          break;
        case "2":
          kois.rating = "2 stars";
          break;
        case "3":
          kois.rating = "3 stars";
          break;
        case "4":
          kois.rating = "4 stars";
          break;
        case "5":
          kois.rating = "5 stars";
          break;
      }

      if (kois.koiId) {
        // => update
        const response = await api.put(`/koi/update/${kois.koiId}`, kois);
        toast.success("Update Koi request sucessfully!");
      } else {
        // => create
        const response = await api.post(`/koi/creation/${breederid}`, kois);
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
            <Form.Item
              label="Breeder"
              name="breeder"
              initialValue={breeders}
            >
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
          <div className={styles.koiMethod}>
            <h2
              className={styles.koiTitle}
              style={{
                display: "inline-block",
                marginRight: "8px",
              }}
            >
              Rating
            </h2>

            {/* <Tooltip>
              <QuestionCircleOutlined
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setMethodInfoVisible(true)}
              />
            </Tooltip> */}
            {/* <Modal
              title="Method information"
              visible={methodInfoVisible}
              onCancel={() => setMethodInfoVisible(false)}
              footer={null}
            >
              <div>
                <h3>Method 1: Fixed Price Selling</h3>
                <p>
                  In this format, the price of the Koi fish is set at a specific
                  amount. If one person wants to buy, the price remains fixed.
                  However, if two or more people wish to purchase the same fish,
                  when the session closes, the system will randomly select a
                  buyer to determine who gets to purchase the fish.
                </p>
                <h3>Method 2: One-Time Bid</h3>
                <p>
                  When each Koi fish is put up for auction, potential buyers
                  will determine their own bid price for the Koi (this price
                  remains completely confidential). When the auction ends, the
                  highest bidder will win the fish.
                </p>
                <h3>Method 3: Ascending Bid</h3>
                <p>
                  A buyer can place multiple bids, and the highest bidder will
                  be the winner. The bidding information from the buyers is made
                  public.
                </p>
                <h3>Method 4: Descending Bid</h3>
                <p>
                  The auction winner is the first person to accept the starting
                  price or a reduced price (the system will periodically
                  decrease the price if no one places a bid). The bidding
                  information from the buyers is made public.
                </p>
              </div>
            </Modal> */}
            <Form.Item
              name="method"
              rules={[
                { required: true, message: "Please select a bidding method" },
              ]}
            >
              <Select
                placeholder="Select bidding method"
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
