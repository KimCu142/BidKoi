import { Button, Table, Modal, Input, Form } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StaffResponse() {
  const api = "https://66f83af72a683ce9730f0194.mockapi.io/KoiRequest";
  const [kois, setKois] = useState([]);

  //GET
  const fetchData = async () => {
    try {
      const response = await axios.get(api);
      setKois(response.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  // CREATE OR UPDATE
  const handleSubmit = () => {};

  //DELETE
  const handleDelete = (id) => {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table dataSource={kois} />
      <Form>
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
      </Form>
    </div>
  );
}

export default StaffResponse;
