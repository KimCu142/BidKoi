import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!role) {
      toast.error("Please log in to access this page.");
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      toast.error("You do not have permission to access this page.");
    }
  }, [role, allowedRoles]);

  if (!role) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Trả về component nếu người dùng có quyền truy cập
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
