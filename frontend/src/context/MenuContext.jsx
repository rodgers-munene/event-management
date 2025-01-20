import React, { createContext, useState, useContext } from "react";

// Create the context
const MenuContext = createContext();

// Provide the context to the application
export const MenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook for accessing the context
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
