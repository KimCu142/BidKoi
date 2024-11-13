/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Title from "../../subComponents/Title";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const initialValues = {
  username: "",
  password: "",
  role: "",
};

const userSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(5, "Username must be at least 5 characters")
    .max(16, "Username cannot be longer than 16 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username must contain only letters and numbers"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  role: yup.string().required("Role is required"),
});

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

function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await api.post("/account/creation", values);
      toast.success("Create successfully");
      resetForm();
    } catch (error) {
      toast.error("Create fail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      m="20px"
      p="30px"
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f4f6f8",
      }}
    >
      <CustomTitle
        title="CREATE BREEDER/STAFF ACCOUNT"
        subtitle="Create a New Breeder/Staff Profile"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{
                  gridColumn: "span 2",
                  borderRadius: "8px",
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{
                  gridColumn: "span 2",
                  borderRadius: "8px",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{
                  gridColumn: "span 2",
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="BREEDER">Breeder</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#D4163C",
                  borderRadius: "24px",
                  padding: "10px 20px",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#A3122E" },
                  transition: "background-color 0.3s ease",
                }}
                variant="contained"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create New Account"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default Form;
