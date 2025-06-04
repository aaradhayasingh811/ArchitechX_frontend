// // components/Profile.jsx
// import React, { useState, useEffect } from "react";
// import { User, Mail, Key, ImagePlus, LogOut } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {toast} from "react-toastify";

// const Profile = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "John Doe",
//     email: "john@example.com",
//     password: "",
//     confirmPassword: "",
//     avatar: null,
//     avatarPreview: null,
//   });

//   useEffect(() => {
//     const getProfile = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/api/v1/profile`, {
//           withCredentials: true,
//         });

//         console.log(res.data)

//         if (res.status === 200) {
//           const user = res.data;
//           setFormData((prev) => ({
//             ...prev,
//             name: user.name || "John Doe",
//             email: user.email || "example.com",
//             avatar: user.avatar || null,
//             avatarPreview: user.avatar
//               ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
//               : null,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         // alert("Failed to fetch profile data. Please try again later.");
//         toast.error("Failed to fetch profile data. Please try again later")
//       }
//     };

//     getProfile();
//   },[]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       setFormData((prev) => ({
//         ...prev,
//         avatar: file,
//         avatarPreview: URL.createObjectURL(file),


//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     const formPayload = new FormData();
//     formPayload.append("name", formData.name);
//     formPayload.append("email", formData.email);
//     if (formData.password) formPayload.append("password", formData.password);
//     if (formData.avatar) formPayload.append("avatar", formData.avatar);

//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/user/api/v1/profile`,
//         formPayload,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Profile updated successfully!");
//         // alert("Profile updated successfully!");
//         window.location.reload();
//       }
//     } catch (error) {
//       toast.error("Failed to update profile.")
//       console.error("Error updating profile:", error);
//       // alert("Failed to update profile.");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/api/v1/logout`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         // alert("Logged out!");
//         toast.success("Logged out!");
//         navigate("/");
//       } else {
//         toast.error("Logout failed.");
//         console.error("Logout failed");
//       }
//     } catch (error) {
//       toast.error("Logout error!");
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="flex items-center space-x-4">
//           <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//             {formData.avatar ? (
//               <img
//                 src={formData.avatar}
//                 alt="avatar preview"
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <User size={48} className="text-gray-400" />
//             )}
//           </div>
//           <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition">
//             <ImagePlus size={20} /> Change Avatar
//             <input
//               type="file"
//               name="avatar"
//               accept="image/*"
//               onChange={handleChange}
//               className="hidden"
//             />
//           </label>
//         </div>

//         <div>
//           <label className="block font-medium mb-1 flex items-center gap-2">
//             <User size={18} /> Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1 flex items-center gap-2">
//             <Mail size={18} /> Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1 flex items-center gap-2">
//             <Key size={18} /> New Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             placeholder="Leave blank to keep current"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1 flex items-center gap-2">
//             <Key size={18} /> Confirm Password
//           </label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             placeholder="Leave blank to keep current"
//           />
//         </div>

//         <div className="flex justify-between items-center">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Update Profile
//           </button>
//           <button
//             type="button"
//             onClick={handleLogout}
//             className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Profile;
// components/Profile.jsx
import React, { useState, useEffect } from "react";
import { User, Mail, Key, ImagePlus, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Reusable Loader component
const Loader = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4"
  };

  const colorClasses = {
    blue: "border-blue-500 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent"
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    password: "",
    confirmPassword: "",
    avatar: null,
    avatarPreview: null,
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/api/v1/profile`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const user = res.data;
          setFormData((prev) => ({
            ...prev,
            name: user.name || "John Doe",
            email: user.email || "example.com",
            avatar: user.avatar || null,
            avatarPreview: user.avatar || null,

          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    if (formData.password) formPayload.append("password", formData.password);
    if (formData.avatar) formPayload.append("avatar", formData.avatar);

    try {
      setSubmitting(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user/api/v1/profile`,
        formPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out!");
        navigate("/");
      } else {
        toast.error("Logout failed.");
        console.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout error!");
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow flex justify-center items-center h-64">
        <Loader size="xl" />
      </div>
    );
  }

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
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader size="sm" color="white" /> Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {logoutLoading ? (
              <>
                <Loader size="sm" color="white" /> Logging out...
              </>
            ) : (
              <>
                <LogOut size={18} /> Logout
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;