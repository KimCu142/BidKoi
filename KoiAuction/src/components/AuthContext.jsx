/* eslint-disable react/prop-types */

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("user"))
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).username : "";
  });
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername("");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(Boolean(storedUser));
      setUserRole(localStorage.getItem("role"));
      setUsername(storedUser ? JSON.parse(storedUser).username : "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        username,
        logout,
        setUserRole,
        setIsLoggedIn,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
