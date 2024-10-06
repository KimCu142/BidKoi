import "./availableauction.css";
import { Suspense, useState } from "react";
import { motion, MotionConfig, useMotionValue } from "framer-motion";
import { Shapes } from "./Shapes";
import { transition } from "./settings";
import useMeasure from "react-use-measure";
function availableaution() {

  const [ref, bounds] = useMeasure({ scroll: false });
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const resetMousePosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  return (

    <div className="IntoAuction">
      <div >
        <MotionConfig transition={transition}>
          <motion.button
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
            onTap={() => setIsPress(false)}
            onTapCancel={() => setIsPress(false)}
            onPointerMove={(e) => {
              mouseX.set(e.clientX - bounds.x - bounds.width / 2);
              mouseY.set(e.clientY - bounds.y - bounds.height / 2);
            }}
          >
            <motion.div
              className="shapes"
              variants={{
                rest: { opacity: 0 },
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
              Auction #1


            </motion.div>
          </motion.button>
        </MotionConfig>

        <div className="AuctionInfo">
          <p>Start Date: 2024-10-07</p>
          <p>End Date: 2024-10-10</p>
          <p>Status: Ongoing</p>
        </div>

      </div>
    </div>
  )
}

export default availableaution
