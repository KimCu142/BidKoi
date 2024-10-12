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
  TimePicker,
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
import moment from "moment-timezone";

function CreateAuction() {
  const [auctions, setAuctions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const fetchAuction = async () => {
    try {
      const response = await api.get(`/auctions`);
      const auctionData = response.data.map((auction) => ({
        ...auction,
        startTime: auction.startTime ? moment(auction.startTime) : null,
        endTime: auction.endTime ? moment(auction.endTime) : null,
      }));
      setAuctions(auctionData);
    } catch (err) {
      toast.error("Failed to fetch Auction data");
    }
  };

  useEffect(() => {
    fetchAuction();
  }, []);

  const statusColors = {
    PENDING: "#d9d9d9",
    ACCEPTED: "#52c41a",
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
      title: "Auction Id",
      dataIndex: "auctionId",
      key: "auctionId",
      render: (text) => `#${text}`,
    },
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY, hh:mm:ss A") : "",
    },
    {
      title: "EndTime",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY, hh:mm:ss A") : "",
    },
    {
      title: "Action",
      dataIndex: "auctionId",
      key: "auctionId",
      render: (auctionId, auctionRequest) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              // form.setFieldsValue(auctionRequest);
              setOpenModal(true);
              form.setFields([
                { name: "auctionId", value: auctionRequest.auctionId },
                { name: "startTime", value: null },
                { name: "endTime", value: null },
              ]);
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //DELETE
  const handleDelete = async (auctionId) => {
    try {
      await api.delete(`/auctions/delete/${auctionId}`);
      toast.success("Successfully delete!");
      fetchAuction();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  //CREATE OR UPDATE
  const handleSubmitAuction = async (auctions) => {
    try {
      setLoading(true);

      // Định dạng startTime và endTime
      const formattedData = {
        ...auctions,
        startTime: auctions.startTime
          ? auctions.startTime.format("YYYY-MM-DDTHH:mm:ss")
          : null,
        endTime: auctions.endTime
          ? auctions.endTime.format("YYYY-MM-DDTHH:mm:ss")
          : null,
      };

      if (auctions.auctionId) {
        // => update
        await api.put(`/auctions/update/${auctions.auctionId}`, formattedData);
        toast.success("Update auction successfully!");
      } else {
        // => create
        await api.post(`/auctions/create`, formattedData);
        toast.success("Create auction successfully!");
      }

      fetchAuction();
      setOpenModal(false);
      form.resetFields();
    } catch (error) {
      toast.error("Create fail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Auction</h1>
      <Button onClick={handleOpenModal}>Create new auction</Button>
      <Table columns={columns} dataSource={auctions} rowKey="auctionId" />
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
            <Form.Item name="auctionId" hidden>
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
                  {
                    validator: (_, value) => {
                      if (!value || value.isAfter(moment())) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Start time must be after current time")
                      );
                    },
                  },
                ]}
              >
                <DatePicker showTime format="YYYY/MM/DD, hh:mm:ss A" />
              </Form.Item>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter end time",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value.isAfter(getFieldValue("startTime"))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("End time must be after start time")
                      );
                    },
                  }),
                ]}
              >
                <DatePicker showTime format="YYYY/MM/DD, hh:mm:ss A" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateAuction;
