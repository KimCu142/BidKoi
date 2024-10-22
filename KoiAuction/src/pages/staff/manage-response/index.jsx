import { Button, Table, Image, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function StaffResponse() {
  const [kois, setKois] = useState([]);
  const [breeders, setBreeders] = useState({});

  //GET
  const fetchKoiAndBreeder = async () => {
    try {
      // Fetch thông tin koi
      const koiResponse = await api.get(`/koi`);
      setKois(koiResponse.data);

      // Fetch thông tin breeder
      // const breederResponse = await api.get(`/breeder`);
      // if (breederResponse.status === 200) {
      //   setBreeders(breederResponse.data[0]);
      // }
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
      // Xác nhận yêu cầu cá
      await api.post(`/staff/${koiId}/approve`);

      // Tạo room cho Koi
      await api.post(`/room/creation/${koiId}`);

      toast.success("Koi request has been approved and room created");
      fetchKoiAndBreeder();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to approve the koi request");
    }
  };

  const handleReject = async (koiId) => {
    try {
      await api.post(`/staff/${koiId}/reject`);
      toast.success("Koi reuqest has been rejected");
      fetchKoiAndBreeder();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to rejecte the koi request");
    }
  };

  const statusColors = {
    // 0: "#d9d9d9",
    // 1: "#52c41a",
    // 2: "#ff4d4f",
    PENDING: "#d9d9d9", // Trạng thái Pending
    ACCEPTED: "#52c41a", // Trạng thái Approve
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
      title: "Koi Id",
      dataIndex: "koiId",
      key: "koiId",
    },
    {
      title: "Varieties",
      dataIndex: "varieties",
      key: "varieties",
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) => {
        const ageLabel = getJapaneseAge(age);
        return (
          <span>
            {ageLabel} ({age}y)
          </span>
        );
      },
    },
    {
      title: "Breeder",
      dataIndex: ["breeder", "name"],
      key: "breeder",
      render: (_, record) => record.breeder?.name || breeders.name,
      // record: đối tượng đại diện cho 1 hàng trong bảng
      // truy cập thuộc tính "breeder" của từng koi
      // Nếu `breeder` tồn tại và có `name`, nó sẽ hiển thị `name`
      // Nếu không, nó sẽ hiển thị tên mặc định từ `breeders` trong state
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Intitial price",
      dataIndex: "initialPrice",
      key: "initialPrice",
      render: (price) => `${price}VNĐ`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => {
        switch (rating) {
          case 1:
            return "1 star";
          case 2:
            return "2 stars";
          case 3:
            return "3 stars";
          case 4:
            return "4 stars";
          case 5:
            return "5 stars";
        }
      },
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
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (video) => {
        return (
          <video src={video} type="video/mp4" alt="" width={230} controls />
        );
      },
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
                <Button type="primary">Accept</Button>
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
