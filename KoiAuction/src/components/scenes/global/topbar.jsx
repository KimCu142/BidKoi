import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Topbar() {
  return (
    <Box display="flex" justifyContent="right" p={2}>
      <Typography variant="h6">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Back to Home
        </Link>
      </Typography>
    </Box>
  );
}

export default Topbar;