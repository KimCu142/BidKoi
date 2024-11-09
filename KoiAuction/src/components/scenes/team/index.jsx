import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import api from "../../../config/axios";

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

// Thành phần Team để quản lý và hiển thị thông tin thành viên
function Team() {
  const [member, setMember] = useState([]);

  const fetchTeamData = async () => {
    try {
      const response = await api.get("/account");
      const memberId = response.data.map((member, index) => ({
        ...member,
        id: member.id || index,
      }));
      setMember(memberId);
    } catch (error) {
      console.log("Fail to fetch: ", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={
              role === "STAFF"
                ? "#D4163C"
                : role === "BREEDER"
                ? "#4685AF"
                : "#6A9A3B"
            }
            borderRadius="24px"
          >
            {role === "STAFF" && (
              <AdminPanelSettingsOutlinedIcon style={{ fill: "white" }} />
            )}
            {role === "BREEDER" && (
              <ManageAccountsOutlinedIcon style={{ fill: "white" }} />
            )}
            {role === "BIDDER" && (
              <PersonOutlineOutlinedIcon style={{ fill: "white" }} />
            )}
            <Typography color="white" sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px" textAlign="center">
      <CustomTitle
        title="Account"
        subtitle="Manage accounts"
        sx={{
          fontSize: "32px", // Kích thước chữ của tiêu đề
          color: "black", // Màu sắc của tiêu đề
          textTransform: "uppercase", // Chuyển chữ thành chữ in hoa (nếu cần)
        }}
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            fontFamily: "Montserrat, sans-serif",
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #E0E0E0",
            padding: "10px",
          },
          "& .name-column--cell": {
            color: "#4685AF",
            fontWeight: "600",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#E8E8E8",
            color: "#333",
            fontWeight: "bold",
            fontSize: "16px",
            borderBottom: "2px solid #B0B0B0",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "#F9F9F9",
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#FAFAFA",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#E8E8E8",
            borderTop: "1px solid #B0B0B0",
          },
          "& .MuiCheckbox-root": {
            color: "black !important",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "black !important",
          },
        }}
      >
        <DataGrid
          rows={member}
          columns={columns}
          getRowId={(row) => row.username}
          sx={{
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "#E6E6FA !important",
              color: "#333",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default Team;
