import { motion } from "framer-motion";

const SpinImage = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity, // Lặp lại xoay liên tục
        duration: 2, // Thời gian mỗi vòng xoay
        ease: "linear", // Quay đều
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/spin-image%2Fauction_koi_logo.png?alt=media&token=61002108-7cad-4523-9ff3-b97a7e992c90"
        alt="Loading..."
        style={{
          width: 100,
          height: 100,
        }}
      />
    </motion.div>
  );
};

export default SpinImage;
