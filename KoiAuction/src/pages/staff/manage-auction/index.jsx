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
  const [auctions, setAuctions] = useState([]);
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

  const api = "https://66f83af72a683ce9730f0194.mockapi.io/createAuction";

  const fetchAuction = async () => {
    try {
      const response = await api.get(`${api}`);
      setAuctions(response.data);
    } catch (err) {
      toast.error("Failed to fetch Auction data");
    }
  };

  useEffect(() => {
    fetchAuction();
  }, []);

  const columns = [
    {
      title: "Auctin Id",
      dataIndex: "auctionId",
      key: "auctionId",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "EndTime",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Action",
      dataIndex: "koiId",
      key: "koiId",
      render: (koiId, koirequest) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              form.setFieldsValue({
                ...koirequest,
                breeder: koirequest.breeder?.name || breeders.name,
                // khi mở modal chỉnh sửa, koirequest.breeder có tồn tại hoặc ko
                // nếu koirequest.breeder tồn tại và có name, giá trị này được dùng
                // nếu ko tồn tại, breeders.name sẽ được sử dụng làm mặc định
              });
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete"
            description="Do you want to delete this request?"
            onConfirm={() => handleDelete(koiId)}
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
  const handleDelete = async (auctionId) => {
    try {
      await api.delete(`${api}`);
      toast.success("Successfully delete!");
      fetchAuction();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  // Check koi exist
  const checkKoiIdExists = async (auctionId) => {
    try {
      const response = await api.get(`${api}`);
      // Giả sử response.data là mảng các đối tượng Koi
      const auctionList = response.data;

      // Kiểm tra xem koiId có trong danh sách không
      return auctionList.some((auction) => auction.auctionId === auctionId);
      // Trả về true nếu tồn tại, false nếu không
    } catch (err) {
      console.error("Lỗi khi kiểm tra koiId:", err); // In ra lỗi nếu có
      return false; // Nếu có lỗi, trả về false
    }
  };

  //CREATE OR UPDATE
  const handleSubmitKoi = async (kois) => {
    kois.status = 0;

    try {
      setLoading(true);

      const exists = await checkKoiIdExists(kois.koiId);

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

      switch (kois.method) {
        case "Fixed Price Selling":
          kois.method = 1;
          break;
        case "One-Time Bid":
          kois.method = 2;
          break;
        case "Ascending Bid":
          kois.method = 3;
          break;
        case "Descending Bid":
          kois.method = 4;
          break;
      }

      if (exists) {
        // => update
        const response = await api.put(`/koi/update/${kois.koiId}`, kois);
      } else {
        // => create
        const response = await api.post(`/koi/create/100`, kois);
      }

      toast.success("Create Koi request sucessfully!");
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
              // hidden
              rules={[
                {
                  required: true,
                  message: "Please enter KoiID",
                },
              ]}
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
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Breeder"
              name="breeder"
              initialValue={breeders.name}
            >
              <Input
                value={breeders.name} // Nếu breeder chưa được tải, mặc định là chuỗi rỗng
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
              <TextArea />
            </Form.Item>
            <Form.Item
              label="Initial price"
              name="initialPrice"
              rules={[
                {
                  required: true,
                  message: "Please enter initialPrice",
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
              Bidding Method
            </h2>

            <Tooltip>
              <QuestionCircleOutlined
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setMethodInfoVisible(true)}
              />
            </Tooltip>
            <Modal
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
            </Modal>
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
                <Option value={1}>Fixed Price Selling</Option>
                <Option value={2}>One-Time Bid</Option>
                <Option value={3}>Ascending Bid</Option>
                <Option value={4}>Descending Bid</Option>
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
