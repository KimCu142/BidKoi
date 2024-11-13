import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../../config/axios";
import { Button, ButtonGroup } from "@mui/material";

const RevenueLineChart = () => {
  const [data, setData] = useState([]);
  const [timeUnit, setTimeUnit] = useState("month"); // State để lưu kiểu thời gian
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get(`/invoice/get-all`);
        const processedData = processInvoiceData(response.data, timeUnit);
        setData(processedData);
      } catch (error) {
        console.log("Error fetching invoice data:", error);
      }
    };

    fetchInvoices();
  }, [timeUnit]); // Cập nhật khi `timeUnit` thay đổi

  const processInvoiceData = (invoices, unit) => {
    const timeRevenue = {};

    invoices.forEach((invoice) => {
      const date = new Date(invoice.date);
      let timeKey;

      // Xác định định dạng thời gian dựa trên `unit`
      if (unit === "month") {
        // Sử dụng định dạng "Month Year" để đảm bảo mỗi tháng thuộc năm hiện tại
        timeKey = `${date.toLocaleString("en-US", {
          month: "long",
        })} ${date.getFullYear()}`;
      } else if (unit === "year") {
        timeKey = date.getFullYear().toString(); // Display year
      }

      const initialPrice = invoice.room.koi.initialPrice;
      const revenue = initialPrice * 0.3;

      if (timeRevenue[timeKey]) {
        timeRevenue[timeKey] += revenue;
      } else {
        timeRevenue[timeKey] = revenue;
      }
    });

    // Nếu đơn vị là tháng, thêm các tháng còn thiếu vào để hiển thị đủ 12 tháng cho năm hiện tại
    if (unit === "month") {
      const allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Duyệt qua từng tháng và đảm bảo tháng nào không có dữ liệu thì đặt giá trị là 0
      allMonths.forEach((month) => {
        const monthKey = `${month} ${currentYear}`; // Tạo khóa "Month Year" cho năm hiện tại
        if (!timeRevenue[monthKey]) {
          timeRevenue[monthKey] = 0; // Set revenue to 0 if there's no data for that month
        }
      });

      // Sắp xếp các tháng theo thứ tự
      return allMonths.map((month) => ({
        time: `${month} ${currentYear}`, // Đảm bảo hiển thị cả tháng và năm
        systemRevenue: timeRevenue[`${month} ${currentYear}`],
      }));
    }

    // Nếu đơn vị là năm hoặc không cần sắp xếp ngày tháng
    return Object.entries(timeRevenue)
      .map(([time, systemRevenue]) => ({
        time,
        systemRevenue,
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time)); // Sắp xếp theo thứ tự thời gian
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {/* Button Group để chuyển đổi cột thời gian */}
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="outlined primary button group"
      >
        <Button onClick={() => setTimeUnit("month")}>Month</Button>
        <Button onClick={() => setTimeUnit("year")}>Year</Button>
      </ButtonGroup>

      {/* Tăng kích thước biểu đồ */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 20,
          }}
        >
          <CartesianGrid
            stroke="#ccc"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
          <XAxis dataKey="time" tick={{ fontSize: 14, fontWeight: "bold" }} />
          <YAxis tick={{ fontSize: 14, fontWeight: "bold" }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontWeight: "bold" }} />
          <Line
            type="monotone"
            dataKey="systemRevenue"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
