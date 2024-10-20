/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

function Title({ title, subtitle }) {
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color="black"
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color="green">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Title;
