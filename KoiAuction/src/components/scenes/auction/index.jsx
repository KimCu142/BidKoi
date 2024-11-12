import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

function Auction() {
  const [auction, setAuction] = useState([]);

  const fetchAuctionData = async () => {
    try {
      const response = await api.get("/auction");
      const auctionData = response.data.map((auction, index) => ({
        ...auction,
        id: auction.auctionId || index,
      }));
      setAuction(auctionData);
    } catch (error) {
      console.log("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchAuctionData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const columns = [
    {
      field: "auctionId",
      headerName: "ID",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          sx={{
            color:
              value === "PENDING"
                ? "#D4163C"
                : value === "ACTIVE"
                ? "green"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {value}
        </Box>
      ),
    },
    {
      field: "rooms",
      headerName: "Rooms",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography>
            {row.rooms.map((room) => room.roomId).join(", ")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography>{formatDate(value)}</Typography>
        </Box>
      ),
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography>{formatDate(value)}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <CustomTitle
        title="Auction Management"
        subtitle="Manage the Auction Events and Rooms"
        sx={{
          fontFamily: "Righteous, sans-serif",
          fontWeight: "bold",
          fontSize: "32px",
          color: "black",
          textAlign: "center",
          mb: 2,
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
          rows={auction}
          columns={columns}
          getRowId={(row) => row.auctionId}
          pageSize={5}
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

export default Auction;
