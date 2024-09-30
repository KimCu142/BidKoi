import { Table } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

function StaffResponse() {
  const api = "https://66f83af72a683ce9730f0194.mockapi.io/KoiRequest";
  const [kois, setKois] = useState([]);

  //GET
  const fetchData = () => {
    try {
      axios.get(api);
    } catch (err) {
      toast.error(err.res);
    }
  };

  // CREATE OR UPDATE
  const handleSubmit = () => {};

  //DELETE
  const handleDelete = (id) => {};

  return (
    <div>
      <Table />
    </div>
  );
}

export default StaffResponse;
