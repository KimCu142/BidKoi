import React, { useEffect, useState } from "react";
import "./AuctionCard.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom"; // For navigation
import api from "../../config/axios";

function AuctionCard() {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);

    // Hàm điều hướng đến trang auction khi nhấn vào
    const handleNavigate = (auctionId) => {
        navigate(`/auctions/${auctionId}`);
    };

    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                const response = await api.get("/auction");
                if (response.data) {
                    setAuctions(response.data);
                }
            } catch (error) {
                console.error("Error fetching auction data:", error);
            }
        };

        fetchAuctionData();
    }, []);

    return (
        <div className="auction-list">
            {auctions.map((auction) => (
                <div
                    className={`auction-card ${
                        auction.status === "PENDING"
                            ? "pending-background"
                            : auction.status === "CLOSED"
                            ? "closed-background"
                            : ""
                    }`}
                    key={auction.auctionId}
                    onClick={() => handleNavigate(auction.auctionId)}
                >
                    <div className="auction-info">
                        <div className="auction-title">
                            <span>Auction #{auction.auctionId}</span>
                        </div>
                        <div className="auction-dates">
                            <p>{new Date(auction.startTime).toLocaleString()} </p>
                            <p>{new Date(auction.endTime).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="auction-arrow">
                        <span>➔</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AuctionCard;
