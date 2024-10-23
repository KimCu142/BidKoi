import "./availableauction.css";
import { Suspense, useState, useEffect } from "react";
import { motion, MotionConfig, useMotionValue } from "framer-motion";
import { Shapes } from "./Shapes";
import { transition } from "./settings";
import useMeasure from "react-use-measure";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../config/axios";

function AvailableAuction() {
  const navigate = useNavigate(); // Khởi tạo navigate
  const [ref, bounds] = useMeasure({ scroll: false });
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // State for holding auction data
  const [auctionData, setAuctionData] = useState(null);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const response = await api.get("/auction/active");
        if (response.data && response.data.data) {
          setAuctionData(response.data.data); 
        }
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctionData();
  }, [token]);



  const resetMousePosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  const handleNavigate = () => {
    if (auctionData) {
      const currentTime = new Date().getTime();
      const startTime = new Date(auctionData.startTime).getTime();
  const auctionId = auctionData.auctionId;
      // Chỉ navigate khi thời gian hiện tại lớn hơn hoặc bằng startTime
      if (currentTime >= startTime) {
        navigate(`/auctions/${auctionId}`);
      } else {
        alert("Auction has not started yet!");
      }
    }
  };
  
  const handleNavigateToSchedule = () => {
    navigate("/auctionschedule");
  };

  return (
    <div className="IntoAuction">
      <div className="AuctionBox">
        <MotionConfig transition={transition}>
          <motion.button
          className="button"
            ref={ref}
            initial={false}
            animate={isHover ? "hover" : "rest"}
            whileTap="press"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.5 },
              press: { scale: 1.4 }
            }}
            onHoverStart={() => {
              resetMousePosition();
              setIsHover(true);
            }}
            onHoverEnd={() => {
              resetMousePosition();
              setIsHover(false);
            }}
            onTapStart={() => setIsPress(true)}
            onTap={() => {
              setIsPress(false);
              handleNavigate(); // Gọi hàm điều hướng khi ấn
            }}
            onTapCancel={() => setIsPress(false)}
            onPointerMove={(e) => {
              mouseX.set(e.clientX - bounds.x - bounds.width / 2);
              mouseY.set(e.clientY - bounds.y - bounds.height / 2);
            }}
          >
            <motion.div
              className="shapes"
              variants={{
                rest: { opacity: 1 },
                hover: { opacity: 1 }
              }}
            >
              <div className="pink blush" />
              <div className="blue blush" />
              <div className="container">
                <Suspense fallback={null}>
                  <Shapes
                    isHover={isHover}
                    isPress={isPress}
                    mouseX={mouseX}
                    mouseY={mouseY}
                  />
                </Suspense>
              </div>
            </motion.div>
            <motion.div
              variants={{ hover: { scale: 0.85 }, press: { scale: 1.1 } }}
              className="label"
            >
              Auction #{auctionData?.auctionId}
            </motion.div>
          </motion.button>
        </MotionConfig>

        <div className="AuctionInfo">
          <>
          <p>Start Date: {new Date(auctionData?.startTime).toLocaleString()}</p>
          <p>End Date: {new Date(auctionData?.endTime).toLocaleString()}</p>
          <p>Status: {auctionData?.status}</p>
          </>
          <button onClick={handleNavigateToSchedule} className="schedule-button">
            View Auction Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailableAuction;
