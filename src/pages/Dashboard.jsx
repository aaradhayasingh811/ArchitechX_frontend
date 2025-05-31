import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import a from "../assets/logo-sidebar.png"; 
import {
  User,
  PlusCircle,
  LayoutTemplate,
  FolderKanban,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  return (
    <div
      className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white flex flex-col justify-between transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <span className="text-2xl font-bold">
            <img src={a} alt="" />
          </span>
          <button onClick={toggleSidebar} className="md:hidden text-gray-300">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col space-y-2 px-4 py-4">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <User size={20} /> Profile
          </Link>
          <Link
            to="/dashboard/create-project"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <PlusCircle size={20} /> Create Project
          </Link>
          <Link
            to="/dashboard/projects"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <FolderKanban size={20} /> My Projects
          </Link>
          <Link
            to="/dashboard/templates"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <LayoutTemplate size={20} /> Templates
          </Link>
          <Link
            to="/dashboard/dynamic-canvas"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <PlusCircle size={20} /> Free hand Layout
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-3 hover:bg-red-700 bg-red-600 w-full text-left"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 bg-gray-100 p-4 md:p-6 overflow-auto w-full">
        <div className="md:hidden mb-4">
          <button onClick={toggleSidebar} className="text-gray-700">
            <Menu size={24} />
          </button>
        </div>
        {/* This renders matched child route */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
