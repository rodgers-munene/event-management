import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used inside the AuthProvider!");
  }

  return context;
};

// Create the Provider to manage global state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isLogin, setIsLogin] = useState(true); // Default state: show login form

  // check token validity on first mount and every 15 minutes
  useEffect(() => {
    const checkTokenValidity = () => {
      const expiry = localStorage.getItem("expiresAt");
      if (expiry && Date.now() > expiry) {
        logout()
      }
    };
    checkTokenValidity();

    // set an interval to check validity of token every 15 minutes
    const interval = setInterval(checkTokenValidity, 900000)

    return () => clearInterval(interval)
  }, []);

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
  // Function to toggle between login and registration
  const toggleAuthForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
