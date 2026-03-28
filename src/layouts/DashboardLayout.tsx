import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[240px] transition-all duration-200">
        <Navbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
