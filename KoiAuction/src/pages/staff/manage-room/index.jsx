/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Checkbox, Descriptions, List, message, Modal } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const RoomDetail = () => {
  const { auctionId } = useParams(); // Lấy auctionId từ URL
  const [auction, setAuction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]); // ds room
  const [selectedRooms, setSelectedRooms] = useState([]); // Lưu trữ cá đã được chọn
  const [allAuctions, setAllAuctions] = useState([]); // Tất cả các auction

  const formatDate = (dateString) => dateString.replace("T", " ");
  const fetchAuctions = async () => {
    try {
      const response = await api.get("/auction");
      const auctionsData = response.data;
      setAllAuctions(auctionsData);

      // Tìm auction hiện tại
      const auctionData = auctionsData.find(
        (a) => a.auctionId === Number(auctionId)
      );
      if (auctionData) {
        setAuction(auctionData);
        setSelectedRooms(auctionData.rooms || []);
      } else {
        message.error("Auction not found");
      }
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get("/room");
      const roomList = response.data.data.filter(
        (room) => room.roomId !== null
      );

      // Lấy tất cả các room đã được thêm vào bất kỳ auction nào
      const roomsInOtherAuctions = allAuctions.flatMap(
        (auction) => auction.rooms || []
      );
      const availableRooms = roomList.filter(
        (room) =>
          !roomsInOtherAuctions.some(
            (addedRoom) => addedRoom.roomId === room.roomId
          )
      );

      setRooms(availableRooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };
  // GET danh sách auction
  useEffect(() => {
    fetchAuctions();
    fetchRooms();
  }, []);

  // CREATE
  const handleAddRoom = async (room) => {
    try {
      await api.post(`/auction/${auctionId}/room/${room.roomId}`);
      setSelectedRooms((prevSelected) => [...prevSelected, room]);
      setRooms((prevRooms) =>
        prevRooms.filter((r) => r.roomId !== room.roomId)
      );
      toast.success("Room added successfully!");
    } catch (error) {
      toast.error("Failed to add room to auction");
    }
  };

  //DELETE
  const handleRemoveRoom = (room) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.filter((r) => r.roomId !== room.roomId)
    );
    setRooms((prevRooms) => [...prevRooms, room]);
    toast.info("Room removed successfully");
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  if (!auction) {
    return <p>Loading auction details or auction not found...</p>;
  }

  return (
    <>
      <Descriptions
        title={`Auction #${auction.auctionId}`}
        bordered
        column={1}
        style={{ marginTop: 24 }}
      >
        <Descriptions.Item label="Start Time">
          {formatDate(auction.startTime)}
        </Descriptions.Item>
        <Descriptions.Item label="End Time">
          {formatDate(auction.endTime)}
        </Descriptions.Item>
      </Descriptions>

      <Button type="primary" onClick={handleOpenModal}>
        Add Rooms to Auction
      </Button>

      <Modal
        title="Select Room to Add"
        onCancel={handleCancel}
        open={showModal}
        footer={null}
      >
        <List
          dataSource={rooms.filter(
            (room) =>
              !selectedRooms.some(
                (selectedRoom) => selectedRoom.roomId === room.roomId
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

      {selectedRooms.length > 0 && (
        <List
          style={{ marginTop: 16 }}
          bordered
          header={<div>Selected Room Details</div>}
          dataSource={selectedRooms}
          renderItem={(room) => (
            <List.Item key={room.roomId}>
              <div>
                Room ID: {room.roomId}, Koi ID: {room.koiId}
              </div>
              <Button type="danger" onClick={() => handleRemoveRoom(room)}>
                Remove
              </Button>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default RoomDetail;
