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
  DatePicker,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uploadFile from "../../../utils/file";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../config/firebase";
import api from "../../../config/axios";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import styles from "./index.module.scss";

function CreateAuction() {
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
  const { RangePicker } = DatePicker;

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
      render: (auctionId, auctionrequest) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setOpenModal(true);
              form.setFieldsValue(auctionrequest);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete"
            description="Do you want to delete this request?"
            onConfirm={() => handleDelete(auctionId)}
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
  const checkAuctionIdExists = async (auctionId) => {
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
  const handleSubmitAuction = async (auctions) => {
    // kois.status = 0;
    try {
      setLoading(true);

      // Định dạng startTime và endTime
      const formattedData = {
        ...auctions,
        startTime: auctions.startTime.format("YYYY-MM-DD HH:mm:ss"),
        endTime: auctions.endTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      const exists = await checkAuctionIdExists(auctions.auctionId);

      if (exists) {
        // => update
        const response = await api.put(
          `/koi/update/${auctions.auctionId}`,
          formattedData
        );
      } else {
        // => create
        const response = await api.post(`/koi/create/100`, formattedData);
      }

      toast.success("Create auction sucessfully!");
      await fetchAuction();
      setOpenModal(false);
      form.resetFields();
    } catch (err) {
      toast.error("Create fail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Auction</h1>
      <Button onClick={handleOpenModal}>Create new auction</Button>
      <Table columns={columns} dataSource={auctions} />
      <Modal
        confirmLoading={loading}
        onOk={() => form.submit()}
        centered
        open={openModal}
        onCancel={handleCloseModal}
        width={500}
      >
        <h2 className={styles.auctionTitle}>Fill the information</h2>
        <Form
          form={form}
          onFinish={handleSubmitAuction}
          labelCol={{ span: 24 }}
        >
          <div className={styles.auctionTitle}>
            {/* <Form.Item name="status" initialValue={0} hidden>
              <Input type="hidden" />
            </Form.Item> */}
            <Form.Item
              label="Auction Id"
              name="auctionId"
              rules={[
                {
                  required: true,
                  message: "Please enter Auction Id",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className={styles.timePickerContainer}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter start time",
                  },
                ]}
              >
                <DatePicker renderExtraFooter={() => "extra footer"} showTime />
              </Form.Item>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter end time",
                  },
                ]}
              >
                <DatePicker renderExtraFooter={() => "extra footer"} showTime />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateAuction;
