import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPasswordFlow from "./components/ForgotPasswordFlow";
import LayoutForm from "./pages/LayoutForm";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Profile from "./components/Profile";
import CreateNewProject from "./components/CreateNewProject";
import Projects from "./components/Projects";
import Templates from "./components/Templates";
import Editor from "./pages/Editor";
import { useState } from "react";
import VastuChatbotToggle from "./components/VastuChatbotToggle";
export default function App() {
  return (
    <>
          <GoogleOAuthProvider clientId="448608361529-d7f2ugjsgf410d0nbuvhnl50mk4l482p.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="create-project" element={<CreateNewProject />} />
              <Route path="layout-form" element={<LayoutForm />} />
              <Route path="projects" element={<Projects />} />
              <Route path="templates" element={<Templates />} />
              <Route path="dynamic-canvas" element={<Editor />} />
              {/* Add more nested routes here */}
            </Route>
            {/* <Route path="/chatbot-vastu" element={<VastuChatbotToggle />} /> */}
        </Routes>
      </BrowserRouter>
          </GoogleOAuthProvider>
    </>
  );
}
