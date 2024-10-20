import "./Bidding.css";
import { Image } from 'antd';
import axios from "axios";
import { useState, useEffect } from "react";
import { InfoCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Popover, Button, Space, Modal, FloatButton } from "antd";
import KoiTable from "../../components/KoiTable/KoiTable";
import { useParams } from "react-router-dom";
import BidTable from "../../components/KoiTable/BidTable";
import PastBids from "../../components/KoiTable/PastBid";
import ChatBot from "../../components/KoiTable/ChatBot";
import Chat from "../Chat/Chat";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from "canvas-confetti";


const auctionInfoContent = (
    <div>
        <p>
            In-House Auctions have a shorter shipping lead time (1-2 weeks) on average
            and lower overall cost.
        </p>
        <p>
            Koi in this auction are currently being held at Select Koi in Sevierville,
            TN and thus are ready to ship after fasting to ensure safe delivery.
        </p>
        <p>
            A shipping deposit of $110/koi won will be charged at the end of the
            auction, then adjusted when bulk shipping is calculated.
        </p>
    </div>
);

export default function Bidding() {
    const token = localStorage.getItem("token");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const userData = JSON.parse(storedUser);  // Parse dữ liệu JSON từ localStorage

            // Kiểm tra và lấy dữ liệu từ userData
            if (userData) {
                setUsername(userData.username);  // Đặt username
            } else {
                console.error("Token or username is undefined");
            }
        }
    }, []);

    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const showModal = () => {
        setIsModalVisible2(true);
    };
    const handleCancel = () => {
        setIsModalVisible2(false);
    };

    const { roomId } = useParams();
    const [auctionDetails, setAuctionDetails] = useState({});
    const [room, setRoom] = useState([null]);
    const [winnerInfo, setWinnerInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.bidder.id;


    const fireConfetti = () => {
        const duration = 5 * 1000; // Thời gian kéo dài của pháo hoa
        const animationEnd = Date.now() + duration;
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 100; // Số hạt mỗi lần bắn
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                },
                colors: ['#bb0000', '#ffffff'], // Tùy chỉnh màu sắc
            });
        }, 200); // Tần suất mỗi lần bắn pháo
    };

    useEffect(() => {
        // Fetch data using Axios
        const token = localStorage.getItem("token");

        axios
            .get(`http://localhost:8080/BidKoi/auction/active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                const auctionData = response.data.data;
                setAuctionDetails(auctionData);
                const selectedRoom = auctionData.rooms.find(
                    (room) => room.roomId === parseInt(roomId)
                );
                setRoom(selectedRoom);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [roomId]);



    useEffect(() => {
        if (auctionDetails.endTime && room) {
            const endTime = new Date(auctionDetails.endTime).getTime();
            const interval = setInterval(async () => {
                if (new Date().getTime() >= endTime) {
                    clearInterval(interval); // Xoá interval khi kết thúc thời gian đấu giá
                    try {
                        console.log("Room :"+ roomId)
                        const response = await axios.get(`http://localhost:8080/BidKoi/placeBid/winner/${roomId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        });
                        const winnerName = response.data.data.username;
                        console.log("UserName " + winnerName);
                        if (username === winnerName) {
                            setIsModalVisible(true);

                            // Kích hoạt pháo hoa
                            fireConfetti();

                            toast.success("Congratulations, you've won this auction! Click here", {
                                onClick: () => window.location.href = `/auction/${roomId}/details`,
                                style: { backgroundColor: '#d4edda', color: '#155724' },
                            });
                        } else {
                            toast.info("Unfortunately, you didn't win this auction. Better luck next time!", {
                                style: { backgroundColor: '#f8d7da', color: '#721c24' },
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching winner:", error);
                    }
                }
            }, 1000);

            return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, [auctionDetails.endTime, roomId, room, username, token]);




    if (!room || !room.koi) {
        return <div>Loading...</div>;
    }

    return (
        <div className="BiddingPage ">
            <AuctionInfo />
            <div className="Bidding" >
                <div className="Visual">
                    <div className="img">
                        <Image className="custom-image" src={room.koi.image} />
                    </div>
                    <video
                        src={room.koi.video}
                        controls
                        width="100%"
                        alt="Koi Video"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="KoiTable">
                    <KoiTable
                        name={room.koi.varieties}
                        id={room.koi.koiId}
                        rating={5}
                        sex={room.koi.sex}
                        length={room.koi.length}
                        breeder={room.koi.breeder.name}
                        age={room.koi.age}
                        status={room.koi.status}
                        endTime={auctionDetails.endTime}
                        className={auctionDetails.endTime}
                    />
                    <div className="Bidding2">
                        <div className="Bidding2mini" >
                            <BidTable />
                        </div>
                        <div className="Chat2">
                            <Chat />
                        </div>

                    </div>
                </div>
            </div>
            <>
                <FloatButton
                    type="primary"
                    style={{ insetInlineEnd: 24 }}
                    icon={<CustomerServiceOutlined />}
                    onClick={showModal}
                />

                <Modal
                    title="Chat"
                    visible={isModalVisible2}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <ChatBot />
                </Modal>
            </>
        </div>
    );
}

const AuctionInfo = () => {
    return (
        <div >
            <div className="auctionsInfo">
                <div className="auctionTitle">
                    <span>Auction #1</span>
                    <div className="time">
                        <p className="dateRange">28/9/2024 -</p>{" "}
                        <p className="dateRange">30/9/2024</p>
                        <p className="ended">Ended 7 days Ago</p>
                    </div>
                </div>
                <div>
                    <Space wrap>
                        <Popover
                            content={auctionInfoContent}
                            title="In-House Auction Info"
                            trigger="click"
                        >
                            <Button className="Button">
                                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />{" "}
                                In-House Auction Info
                            </Button>
                        </Popover>
                    </Space>
                </div>
            </div>
        </div>
    );
};