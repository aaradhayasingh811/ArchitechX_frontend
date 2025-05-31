// components/Profile.jsx
import React, { useState } from "react";
import { User, Mail, Key, ImagePlus, LogOut } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    password: "",
    confirmPassword: "",
    avatar: null,
    avatarPreview: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Submit formData to backend here
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    alert("Logged out!");
    // Redirect or cleanup logic here
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {formData.avatarPreview ? (
              <img
                src={formData.avatarPreview}
                alt="avatar preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition">
            <ImagePlus size={20} /> Change Avatar
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <User size={18} /> Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <Mail size={18} /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <Key size={18} /> New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 flex items-center gap-2">
            <Key size={18} /> Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
