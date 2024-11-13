import { Box, Button, Typography } from "@mui/material";
import Title from "../../subComponents/Title";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Overview from "../overview/index ";
import LineChartExample from "../line";

function CustomTitle({ title, subtitle, sx }) {
  return (
    <Box mb="20px" textAlign="center">
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Righteous, sans-serif",
          fontWeight: "bold",
          fontSize: "32px",
          color: "black",
          letterSpacing: "1px",
          ...sx,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "18px",
          color: "green",
          marginTop: "5px",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

function AdminDashboard() {
  return (
    <Box m="20px">
      <CustomTitle
        title="ADMIN DASHBOARD"
        subtitle="Welcome to your admin"
        sx={{
          fontFamily: "Righteous, sans-serif",
          fontWeight: "bold",
          fontSize: "32px",
          color: "black",
          textAlign: "center",
          mb: 2,
        }}
      />

      {/* <Box>
        <Button
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box> */}

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box gridColumn="span 12">
          <Overview /> {/* Hiển thị Overview ở đây */}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
