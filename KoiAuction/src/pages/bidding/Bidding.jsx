import "./Bidding.css";
import { Image } from 'antd';
import axios from "axios";
import { useState, useEffect } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover, Button, Space, Modal } from "antd";
import KoiTable from "../../components/KoiTable/KoiTable";
import { useParams } from "react-router-dom";
import BidTable from "../../components/KoiTable/BidTable";
import PastBids from "../../components/KoiTable/PastBid";
import ChatBot from "../../components/KoiTable/ChatBot";
import Chat from "../Chat/Chat";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const { roomId } = useParams();
    const [auctionDetails, setAuctionDetails] = useState({});
    const [room, setRoom] = useState([null]);
    const [winnerInfo, setWinnerInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.sub;

    useEffect(() => {
        // Fetch data using Axios
        axios
            .get(`http://localhost:8080/BidKoi/auctions/active`)
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
            const interval = setInterval(() => {
                if (new Date().getTime() >= endTime) {
                    clearInterval(interval);
                    axios.get(`/api/auction/room/${roomId}/winner`)
                        .then((response) => {
                            const winnerId = response.data.winnerId;
                            if (currentUserId === winnerId) {
                                axios.get(`http://localhost:8080/BidKoi/account/view/${currentUserId}`)
                                    .then((response) => {
                                        setWinnerInfo(response.data);
                                        setIsModalVisible(true);
                                        toast.success("Congratulations, you've won this auction! Click here", {
                                            onClick: () => window.location.href = `/auction/${roomId}/details`,
                                            style: { backgroundColor: '#d4edda', color: '#155724' },
                                        });
                                    })
                                    .catch((error) => console.error("Error fetching winner info:", error));
                            }
                        })
                        .catch((error) => console.error("Error fetching winner:", error));
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [auctionDetails.endTime, roomId, room, currentUserId]);

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
                        endTime={auctionDetails.startTime}
                        className={auctionDetails.endTime}
                    />
                    <div className="Bidding2">
                        <div className="Bidding2mini" >
                            <BidTable />
                            <PastBids />
                        </div> 
                        <div className="Chat">
                            <Chat />  
                        </div>
                        <div className="ChatBot" >
                            <ChatBot />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Shipping Information"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {winnerInfo && (
                    <div className="ship-info">
                        <h3>Ship Information</h3>
                        <div className="info-row">
                            <span>Address</span>
                            <span>{winnerInfo.address}</span>
                            <span>Shipping time</span>
                            <span>13 - 10 - 2024 19:14 PM</span>
                        </div>
                        <div className="info-row">
                            <span>Phone Number</span>
                            <span>{winnerInfo.phoneNumber}</span>
                        </div>
                        <div className="info-row">
                            <span>Full Name</span>
                            <span>{winnerInfo.fullName}</span>
                        </div>
                    </div>
                )}
            </Modal>
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