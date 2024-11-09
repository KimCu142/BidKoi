import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Title from "../../subComponents/Title";
import { DataGrid } from "@mui/x-data-grid";

import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import MoneyOffCsredOutlinedIcon from "@mui/icons-material/MoneyOffCsredOutlined";
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

function Transaction() {
  const [transaction, setTransaction] = useState([]);

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
      const response = await api.get("/transaction");
      const transactionData = response.data.map((item, index) => ({
        ...item,
        id: index, // Thêm trường id tạm thời dựa vào chỉ mục
      }));
      setTransaction(transactionData);
    } catch (error) {
      console.log("Fail to fetch: ", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const columns = [
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          sx={{ height: "100%" }}
        >
          <Typography width="100%">{formatCurrency(value)}</Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          sx={{ height: "100%" }}
        >
          <Typography width="100%">{formatDate(value)}</Typography>
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: ({ row: { type } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor={
              type === "ADD_MONEY"
                ? "#D4163C"
                : type === "DEPOSIT"
                ? "#4685AF"
                : type === "WITHDRAW"
                ? "yellow"
                : type === "REFUND"
                ? "pink"
                : "#6A9A3B"
            }
            borderRadius="24px"
          >
            {type === "ADD_MONEY" && (
              <CreditScoreOutlinedIcon style={{ fill: "white" }} />
            )}
            {type === "DEPOSIT" && (
              <PriceCheckOutlinedIcon style={{ fill: "white" }} />
            )}
            {type === "WITHDRAW" && (
              <MoneyOffCsredOutlinedIcon style={{ fill: "white" }} />
            )}
            {type === "REFUND" && (
              <CurrencyExchangeOutlinedIcon style={{ fill: "white" }} />
            )}
            {type === "FEE" && (
              <AttachMoneyOutlinedIcon style={{ fill: "white" }} />
            )}
            <Typography color="white" sx={{ ml: "5px", alignItems: "center" }}>
              {type}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <CustomTitle
        sx={{
          fontSize: "32px",
          color: "black",
          textTransform: "uppercase",
        }}
        title="Transaction"
        subtitle="Manage all bill"
      />
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
        <DataGrid rows={transaction} columns={columns} />
      </Box>
    </Box>
  );
}

export default Transaction;
