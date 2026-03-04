import React, { createContext, useContext, useEffect, useState } from "react";
import { updateUser } from "../../api";
import useAuthStore from "../store/authStore";

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
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  // Sync with localStorage on mount (for backwards compatibility)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken && !user && !token) {
      // Parse user and set auth if not already set by Zustand
      try {
        const userData = JSON.parse(storedUser);
        setAuth(userData, storedToken);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
    setInitialized(true);
  }, []);

  // Check token validity on mount and every 15 minutes
  useEffect(() => {
    if (!initialized) return;

    const checkTokenValidity = () => {
      const expiry = localStorage.getItem("expiresAt");
      
      // Only logout if expiry exists AND token is expired
      // If no expiry is set, assume token is valid (for backwards compatibility)
      if (expiry && Date.now() > parseInt(expiry)) {
        console.log("Token expired, logging out");
        storeLogout();
      }
    };
    
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, [initialized, storeLogout]);

  const updateUserInfo = async (updatableData) => {
    const res = await updateUser(user.id, token, updatableData);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data.data));
    storeLogout();
    setAuth(data.data, token);
  };

  const logout = () => {
    storeLogout();
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, token, logout, updateUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
