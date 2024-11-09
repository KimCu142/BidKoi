/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Table,
  List,
  Modal,
  DatePicker,
  Form,
  Input,
} from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import styles from "./index.module.scss";

const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [openAuctionModal, setOpenAuctionModal] = useState(false);
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [allAuctionRooms, setAllAuctionRooms] = useState([]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const fetchAuctions = async () => {
    try {
      const response = await api.get("/auction");
      const auctionData = response.data.map((auction) => ({
        ...auction,
        startTime: auction.startTime ? moment(auction.startTime) : null,
        endTime: auction.endTime ? moment(auction.endTime) : null,
      }));

      const allRooms = auctionData.flatMap((auction) => auction.rooms || []);
      setAllAuctionRooms(allRooms);
      setAuctions(auctionData);
    } catch (error) {
      console.error("Failed to fetch Auction data");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get("/room");
      const roomList = response.data.data.filter(
        (room) => room.roomId !== null
      );
      setRooms(roomList);
    } catch (error) {
      console.error("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchAuctions();
    fetchRooms();
  }, []);

  const handleSubmitAuction = async (auctionData) => {
    try {
      setLoading(true);
      const formattedData = {
        ...auctionData,
        startTime: auctionData.startTime
          ? auctionData.startTime.format("YYYY-MM-DDTHH:mm:ss")
          : null,
        endTime: auctionData.endTime
          ? auctionData.endTime.format("YYYY-MM-DDTHH:mm:ss")
          : null,
      };

      if (selectedAuction && selectedAuction.auctionId) {
        await api.put(
          `/auction/update/${auctionData.auctionId}`,
          formattedData
        );
        toast.success("Update auction successfully!");
      } else {
        await api.post(`/auction/creation`, formattedData);
        toast.success("Create auction successfully!");
      }

      fetchAuctions();
      setOpenAuctionModal(false);
      form.resetFields();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create or update auction");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (room) => {
    if (!selectedAuction || !selectedAuction.auctionId) {
      toast.error("Auction ID is not defined. Please select an auction first.");
      return;
    }

    try {
      await api.post(
        `/auction/${selectedAuction.auctionId}/room/${room.roomId}`
      );
      setSelectedRooms((prevSelected) => [...prevSelected, room]);
      setAllAuctionRooms((prevRooms) => [...prevRooms, room]);
      setRooms((prevRooms) =>
        prevRooms.filter((r) => r.roomId !== room.roomId)
      );
      toast.success("Room added successfully!");
      setOpenRoomModal(false); // Close the room modal after adding
    } catch (error) {
      toast.error("Failed to add room to auction");
    }
  };

  const handleRemoveRoom = async (room) => {
    try {
      await api.delete(
        `/auction/${selectedAuction.auctionId}/room/${room.roomId}`
      );
      setSelectedRooms((prevSelected) =>
        prevSelected.filter((r) => r.roomId !== room.roomId)
      );
      setAllAuctionRooms((prevRooms) =>
        prevRooms.filter((r) => r.roomId !== room.roomId)
      );
      setRooms((prevRooms) => [...prevRooms, room]);
      toast.info("Room removed successfully");
    } catch (error) {
      toast.error("Failed to remove room");
    }
  };

  const handleOpenAuctionModal = (auction) => {
    setSelectedAuction(auction);
    if (auction) {
      form.setFieldsValue({
        auctionId: auction.auctionId,
      });
    } else {
      form.resetFields();
    }
    setOpenAuctionModal(true);
  };

  const handleCloseAuctionModal = () => {
    setOpenAuctionModal(false);
  };

  const handleOpenRoomModal = (auction) => {
    if (!auction) {
      toast.error("Please select an auction first.");
      return;
    }
    setSelectedAuction(auction); // Set selected auction before opening room modal
    setOpenRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setOpenRoomModal(false);
  };

  const handleDelete = async (auctionId) => {
    try {
      await api.delete(`/auction/delete/${auctionId}`);
      toast.success("Successfully deleted auction!");
      fetchAuctions();
    } catch (err) {
      toast.error("Failed to delete auction");
    }
  };

  const handleActivate = async (auctionId) => {
    try {
      await api.put(`/auction/${auctionId}/active`);
      toast.success("Auction activated successfully!");
      fetchAuctions();
    } catch (error) {
      toast.error("Failed to activate auction");
    }
  };

  const handleEnd = async (auctionId) => {
    try {
      await api.put(`/auction/${auctionId}/closed`);
      await api.put(`/transaction/rollback/${auctionId}`); // Rollback transaction

      toast.success("Auction ended and transaction rolled back successfully!");
      fetchAuctions();
    } catch (error) {
      toast.error("Failed to end auction or rollback transaction");
    }
  };
  


  const statusColors = {
    PENDING: "#d9d9d9",
    ACTIVE: "#52c41a",
    CLOSED: "#ff4d4f",
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
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY, hh:mm:ss A") : "",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY, hh:mm:ss A") : "",
    },
    {
      title: "Action",
      dataIndex: "auctionId",
      key: "auctionId",
      render: (auctionId, auction) => (
        <>
          {auction.status !== "CLOSED" && (
            <Button
              style={{ marginRight: "8px" }}
              type="primary"
              onClick={() => handleOpenRoomModal(auction)} // Pass auction to open room modal
            >
              Add Room
            </Button>
          )}
          {auction.status !== "ACTIVE" && auction.status !== "CLOSED" && (
            <>
              <Button
                style={{ marginRight: "8px" }}
                type="primary"
                onClick={() => handleOpenAuctionModal(auction)}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete"
                description="Do you want to delete this auction?"
                onConfirm={() => handleDelete(auctionId)}
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {auction.status === "ACTIVE" && (
            <Popconfirm
              title="End Auction"
              description="Are you sure you want to end this auction?"
              onConfirm={() => handleEnd(auctionId)}
            >
              <Button
                style={{
                  marginLeft: "8px",
                  color: "#fff",
                  backgroundColor: "#ff4d4f",
                  borderColor: "#ff4d4f",
                }}
              >
                End
              </Button>
            </Popconfirm>
          )}
          {auction.status !== "ACTIVE" && auction.status !== "CLOSED" && (
            <Popconfirm
              title="Activate Auction"
              description="Are you sure you want to activate this auction?"
              onConfirm={() => handleActivate(auctionId)}
            >
              <Button
                style={{
                  marginLeft: "8px",
                  color: "#fff",
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  const expandedRowRender = (auction) => {
    return (
      <List
        dataSource={auction.rooms}
        renderItem={(room) => (
          <List.Item key={room.roomId}>
            <div>
              Room ID: {room.roomId}, Koi ID: {room.koi.koiId}
            </div>
            <Button type="danger" onClick={() => handleRemoveRoom(room)}>
              Remove
            </Button>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div>
      <h1>Auction</h1>
      <Button onClick={() => handleOpenAuctionModal(null)}>
        Create new auction
      </Button>
      <Table
        columns={columns}
        dataSource={auctions}
        rowKey="auctionId"
        expandable={{ expandedRowRender }}
      />
      {/* Auction Modal */}
      <Modal
        confirmLoading={loading}
        onOk={() => form.submit()}
        centered
        open={openAuctionModal}
        onCancel={handleCloseAuctionModal}
        width={500}
      >
        <h2 className={styles.auctionTitle}>Fill in the Auction Information</h2>
        <Form
          form={form}
          onFinish={handleSubmitAuction}
          labelCol={{ span: 24 }}
        >
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
        </Form>
      </Modal>

      {/* Room Selection Modal */}
      <Modal
        title="Select Room to Add"
        onCancel={handleCloseRoomModal}
        open={openRoomModal}
        footer={null}
      >
        <List
          dataSource={rooms.filter(
            (room) =>
              !allAuctionRooms.some(
                (addedRoom) => addedRoom.roomId === room.roomId
              )
          )}
          renderItem={(room) => (
            <List.Item key={room.roomId}>
              <div>
                Room ID: {room.roomId}, Koi ID: {room.koi.koiId}
              </div>
              <Button type="primary" onClick={() => handleAddRoom(room)}>
                Add
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Auction;
