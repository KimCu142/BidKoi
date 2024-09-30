import { Table } from "antd";
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
      <Button></Button>
      <Table dataSource={kois} />
    </div>
  );
}

export default StaffResponse;
