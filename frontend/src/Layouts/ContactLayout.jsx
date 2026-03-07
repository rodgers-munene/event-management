import React from "react";
import EventListings from "../Pages/Event Listings";
import { Outlet } from "react-router-dom";

const ContactLayout = ({ children }) => {
  return (
    <div className="overflow-x-hidden">
      <main>
        {children}
        <EventListings />
        <Outlet />
      </main>
    </div>
  );
};

export default ContactLayout;
