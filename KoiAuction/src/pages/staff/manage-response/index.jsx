/* eslint-disable no-unused-vars */
import { Button, Table, Image, Popconfirm, Rate, Modal } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function StaffResponse() {
  const [kois, setKois] = useState([]);
  const [breeders, setBreeders] = useState({});

  const LocalUser = localStorage.getItem("user");
  const UserData = JSON.parse(LocalUser);
  const staffId = UserData.staff.staffId;

  //GET
  const fetchKoiAndBreeder = async () => {
    try {
      const koiResponse = await api.get(`/koi`);
      const sortedKois = koiResponse.data.sort(
        (a, b) => new Date(b.koiId) - new Date(a.koiId)
      );
      setKois(sortedKois);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchKoiAndBreeder();
  }, []);

  const getJapaneseAge = (age) => {
    age = Number(age);

    const baseLabel = [
      "To",
      "Ni",
      "San",
      "Yon",
      "Go",
      "Roku",
      "Nana",
      "Hachi",
      "Kyu",
      "Jyu",
    ];
    return age >= 1 && age <= 10 ? `${baseLabel[age - 1]}sai` : `${age}y`;
  };

  const handleApprove = async (koiId) => {
    try {
      // Tạo room cho Koi
      await api.post(`/room/creation/${koiId}`);
      // Lưu Staff
      await api.put(`/staff/${staffId}/approve/${koiId}`);

      const koi = kois.find((koi) => koi.koiId === koiId);
      const breederFcmToken = koi?.breeder?.account?.fcmToken;

      if (breederFcmToken) {
        const notificationFCM = {
          title: "Koi Request Approved",
          message: "Your Koi request has been approved.",
          fcmToken: breederFcmToken,
        };
        await sendNotification(notificationFCM);
      } else {
        console.warn("FCM token not found for breeder");
      }

      toast.success("Koi request has been approved and room created");
      fetchKoiAndBreeder();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to approve the koi request");
    }
  };

  const handleReject = async (koiId) => {
    try {
      await api.post(`/transaction/rollback-to-breeder/${koiId}`);
      // Lưu Staff
      await api.put(`/staff/${staffId}/reject/${koiId}`);

      const koi = kois.find((koi) => koi.koiId === koiId);
      const breederFcmToken = koi?.breeder?.account?.fcmToken;

      if (breederFcmToken) {
        const notificationFCM = {
          title: "Koi Request Rejected",
          message: "Your Koi request has been rejected.",
          fcmToken: breederFcmToken,
        };
        await sendNotification(notificationFCM);
      } else {
        console.warn("FCM token not found for breeder");
      }

      toast.success("Koi request has been rejected");
      fetchKoiAndBreeder();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to rejecte the koi request");
    }
  };

  const sendNotification = async (notificationFCM) => {
    try {
      await api.post(`/notification/send-notification`, notificationFCM, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Notification sent successfully!");
    } catch (err) {
      console.log("Failed to send notification");
    }
  };

  const statusColors = {
    PENDING: "#d9d9d9",
    ACCEPTED: "#52c41a",
    REJECTED: "#ff4d4f",
  };

  const columns = [
    {
      title: "Status",
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
      title: "Koi Id",
      dataIndex: "koiId",
      key: "koiId",
      sorter: (a, b) => new Date(b.koiId) - new Date(a.koiId),
    },
    {
      title: "Koi Name",
      dataIndex: "varieties",
      key: "varieties",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <Image src={image} alt="" width={115}></Image>;
      },
    },
    {
      title: "Initial price",
      dataIndex: "initialPrice",
      key: "initialPrice",
      render: (price) => `${price.toLocaleString()} VNĐ`, // Định dạng số với dấu chấm
    },
    {
      title: "Immediate price",
      dataIndex: "immediatePrice",
      key: "immediatePrice",
      render: (immediatePrice) =>
        immediatePrice ? `${Number(immediatePrice).toLocaleString()} VNĐ` : "-",
    },
    {
      title: "Detail",
      key: "detail",
      render: (text, record) => (
        <Button
          style={{
            backgroundColor: "#4685af",
            color: "white",
            fontWeight: "500",
          }}
          type="link"
          onClick={() => {
            Modal.info({
              title: "Koi Details",
              content: (
                <div>
                  <p>
                    <strong>ID:</strong> {record.koiId}
                  </p>
                  <p>
                    <strong>Varieties:</strong> {record.varieties}
                  </p>
                  <p>
                    <strong>Length:</strong> {record.length} cm
                  </p>
                  <p>
                    <strong>Sex:</strong> {record.sex}
                  </p>
                  <p>
                    <strong>Age:</strong> {getJapaneseAge(record.age)} (
                    {record.age}y)
                  </p>
                  <p>
                    <strong>Breeder:</strong>{" "}
                    {record.breeder?.name || breeders.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {record.description}
                  </p>
                  <p>
                    <strong>Initial Price:</strong>{" "}
                    {record.initialPrice.toLocaleString()} VNĐ
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    <Rate disabled value={record.rating} />
                  </p>
                  <Image src={record.image} alt="Koi Image" width={115} />
                  <video src={record.video} controls width={230}></video>
                </div>
              ),
              onOk() {},
            });
          }}
        >
          Detail
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "status", // Kiểm tra trạng thái của yêu cầu
      key: "koiId",
      render: (status, { koiId }) => {
        if (status === "PENDING") {
          return (
            <>
              <Popconfirm
                title="Accept"
                description="Do you want to accept this request?"
                onConfirm={() => handleApprove(koiId)}
              >
                <Button type="primary" style={{ marginRight: "8px" }}>
                  Accept
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Reject"
                description="Do you want to reject this request?"
                onConfirm={() => handleReject(koiId)}
              >
                <Button type="primary" danger>
                  Reject
                </Button>
              </Popconfirm>
            </>
          );
        } else {
          return (
            <div style={{ color: statusColors[status], fontWeight: "700" }}>
              {status === "ACCEPTED" ? "Accepted" : "Rejected"}
            </div>
          );
        }
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={kois} />
    </div>
  );
}

export default StaffResponse;
