import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
// import Title from "../../subComponents/Title";
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

function Invoices() {
  const [invoice, setInvoice] = useState([]);

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
  };

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

  const fetchTeamData = async () => {
    try {
      const response = await api.get(`/invoice/get-all`);
      const formattedInvoices = response.data.map((item) => ({
        ...item,
        winner: item.room.winner,
        finalPrice: item.room.koi.finalPrice,
      }));
      setInvoice(formattedInvoices);
    } catch (error) {
      console.log("Fail to fetch: ", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const columns = [
    { field: "invoiceId", headerName: "ID" },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          sx={{ height: "100%" }}
        >
          {" "}
          <Typography>{formatDate(params.row.date)}</Typography>
        </Box>
      ),
    },
    {
      field: "winner",
      headerName: "Winner",
      flex: 1,
    },
    {
      field: "finalPrice",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          sx={{ height: "100%" }}
        >
          <Typography>{formatCurrency(params.row.finalPrice)}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <CustomTitle title="INVOICES" subtitle="List of Invoices" />

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
          rows={invoice}
          // checkboxSelection
          getRowId={(row) => row.invoiceId}
          columns={columns}
        />
      </Box>
    </Box>
  );
}

export default Invoices;
