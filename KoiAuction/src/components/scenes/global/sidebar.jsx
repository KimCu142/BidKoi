/* eslint-disable no-unused-vars */
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ContactsIcon from "@mui/icons-material/Contacts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HelpIcon from "@mui/icons-material/Help";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PieChartIcon from "@mui/icons-material/PieChart";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import PaidIcon from "@mui/icons-material/Paid";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected, sx }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{
        backgroundColor: "transparent !important",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography
        sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", ...sx }}
      >
        {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

function Besidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  return (
    <Box
      sx={{
        height: "100vh",
        "& .pro-sidebar-inner": {
          background: "#e4e4e4 !important",
        },
        "& .pro-sidebar-wrapper": {
          backgroundColor: "transparent !important",
          height: "100%",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#D4163C !important",
          backgroundColor: "transparent !important",
        },
        "& .pro-menu-item .pro-icon-wrapper": {
          backgroundColor: "transparent !important", // Đảm bảo nền của icon cũng trong suốt
        },
        "& .pro-menu-item.active": {
          color: "#75051B !important",
          backgroundColor: "transparent !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "#D9D9D9",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  fontSize="24px"
                  fontFamily="Montserrat, sans-serif"
                  color="black"
                >
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && (
            <Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src="https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/Screenshot%202024-10-22%20101044.png?alt=media&token=72e02af8-db75-42e9-aa00-e49c7d755134"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  fontSize="32px"
                  fontFamily="Righteous, sans-serif"
                  color="black"
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Kim Cuong
                </Typography>
                {/* <Typography
                  fontSize="16px"
                  fontFamily="Montserrat, sans-serif"
                  color="red"
                >
                  BidKoi Admin
                </Typography> */}
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px" }}
              title="Dashboard"
              to="dashboard"
              icon={<DashboardIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              fontSize="18px"
              fontFamily="Righteous, sans-serif"
              color="black"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Account"
              to="team"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transaction"
              to="transaction"
              icon={<PaidIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Auction & Room"
              to="auction"
              icon={<GavelOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="invoices"
              icon={<ReceiptIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              fontSize="18px"
              fontFamily="Righteous, sans-serif"
              color="black"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="form"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Calendar"
              to="calendar"
              icon={<DateRangeIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Typography
              fontSize="18px"
              fontFamily="Righteous, sans-serif"
              color="black"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Overview"
              to="overview"
              icon={<LeaderboardIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Pie Chart"
              to="pie"
              icon={<PieChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}

export default Besidebar;
