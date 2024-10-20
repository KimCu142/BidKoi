import { Box } from "@mui/material";
import Title from "../../subComponents/Title";

function AdminDashboard() {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Title title="ADMIN DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
    </Box>
  );
}

export default AdminDashboard;
