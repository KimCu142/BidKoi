import { Button, Form, Input, Modal, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./index.module.scss";

function BreederRequest() {
  const [kois, setKois] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);

  const api = "https://66f83af72a683ce9730f0194.mockapi.io/KoiRequest";

  const fetchKoi = async () => {
    try {
      const response = await axios.get(api);
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
      dataIndex: "KoiID",
      key: "KoiID",
    },
    {
      title: "Varieties",
      dataIndex: "Varieties",
      key: "Varieties",
    },
    {
      title: "Length",
      dataIndex: "Length",
      key: "Length",
    },
    {
      title: "Sex",
      dataIndex: "Sex",
      key: "Sex",
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
    },
    {
      title: "Breeder",
      dataIndex: "Breeder",
      key: "Breeder",
    },
    {
      title: "Intitial price",
      dataIndex: "InititalPrice",
      key: "InititalPrice",
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
      render: (Image) => {
        return <img src={Image} alt="" width={200} />;
      },
    },
    {
      title: "Video",
      dataIndex: "Video",
      key: "Video",
      render: (Video) => {
        return (
          <video src={Video} type="video/mp4" alt="" width={200} controls />
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitKoi = async (koi) => {
    try {
      setSubmitting(true);
      const response = await axios.post(api, koi);
      toast.success("Create Koi request sucessfully!");
      setOpenModal(false);
      form.resetFields();
    } catch (err) {
      toast.err("Create fail");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Breeder Request</h1>
      <Button onClick={handleOpenModal}>Create new Koi Request</Button>
      <Table columns={columns} dataSource={kois} />
      <Modal
        confirmLoading={submitting}
        onOk={() => form.submit()}
        centered
        open={openModal}
        onCancel={handleCloseModal}
        width={1000}
      >
        <h2 className={styles.koiTitle}>Basic Information</h2>
        <Form form={form} onFinish={handleSubmitKoi} labelCol={{ span: 24 }}>
          <div className={styles.koiInfo}>
            <Form.Item
              label="Koi Id"
              name="KoiID"
              rules={[
                {
                  required: true,
                  message: "Please enter Koi Id",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Koi Varieties"
              name="Varieties"
              rules={[
                {
                  required: true,
                  message: "Please enter Koi's varieties",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Breeder" name="Breeder">
              <Input />
            </Form.Item>
            <Form.Item
              label="Length"
              name="Length"
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
              name="Sex"
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
              name="Age"
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
            <Form.Item></Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default BreederRequest;
