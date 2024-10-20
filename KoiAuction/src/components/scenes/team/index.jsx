import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Title from "../../subComponents/Title";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import api from "../../../config/axios";
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
    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   headerAlign: "left",
    //   align: "left",
    // },
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
            <Typography color="white" sx={{ ml: "5px", alignItems: "center" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Title title="Account" subtitle="Manage the Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: "#4685AF",
            fontWeight: "600",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#E8E8E8",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#f0f0f0",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#E8E8E8",
            borderTop: "none",
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
        />
      </Box>
    </Box>
  );
}

export default Team;
