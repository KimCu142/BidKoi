import { Button, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CreateAuction() {
  const api = "https://66f83af72a683ce9730f0194.mockapi.io/KoiRequest";
  const [auctions, setAuctions] = useState([]);

  //GET
  const fetchData = async () => {
    try {
      const response = await axios.get(api);
      setAuctions(response.data);
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
      <Button>Create new Auction</Button>
      <Table dataSource={auctions} />
    </div>
  );
}

export default CreateAuction;
