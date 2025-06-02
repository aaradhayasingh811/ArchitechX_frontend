// import React, { useEffect, useState } from "react";
// import { LayoutList, Box, Eye, Cuboid } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProjectCard = ({ name, description, openinForm, deletetheCard }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
//       <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//         <LayoutList size={20} className="text-blue-600" /> {name}
//       </h3>
//       <p className="text-gray-600 whitespace-pre-wrap">
//         {description || "No description provided."}
//       </p>
//       <div className="flex gap-4 flex-wrap">
//         <button
//           onClick={openinForm}
//           className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[#172a91] hover:bg-[#151e60] text-white font-semibold py-2 rounded transition"
//           aria-label={`View in form of ${name}`}
//         >
//           <Eye size={16} /> Open
//         </button>
//         <button
//           onClick={deletetheCard}
//           className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[#172a91] hover:bg-[#151e60] text-white font-semibold py-2 rounded transition"
//           aria-label={`Delete project ${name}`}
//         >
//           <Cuboid size={16} /> Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// // const demoProjects = [
// //   {
// //     id: 1,
// //     name: "Modern Family Home",
// //     description: "A spacious 4-bedroom home with open-plan living and a large garden.",
// //   },
// //   {
// //     id: 2,
// //     name: "Urban Apartment",
// //     description: "Compact 2-bedroom apartment perfect for city living with great natural light.",
// //   },
// //   {
// //     id: 3,
// //     name: "Luxury Villa",
// //     description: "An elegant villa featuring a pool, gym, and panoramic views.",
// //   },
// //   {
// //     id: 4,
// //     name: "Tiny House",
// //     description: "Minimalist tiny house design with multi-functional spaces and eco-friendly materials.",
// //   },
// //   {
// //     id: 5,
// //     name: "Commercial Office Space",
// //     description: "Flexible office layout designed for productivity and collaboration.",
// //   },
// // ];

// const Projects = () => {
//   useEffect(() => {
//     const getProjects = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/layout/api/v1/all-layout`,
//           {
//             withCredentials: true,
//           }
//         );
//         setData(res.data.layouts);
//         // console.log(res.data);
//       } catch (error) {
//         toast.error("Error fetching projects");
//         console.error("Error fetching projects:", error);
//       }
//     };

//     getProjects();
//   }, []);

//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [homeParameters, setHomeParameters] = useState(null);

//   const getHomeParameters = async (projectId) => {
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_API_URL
//         }/layout/api/v1/home-parameters/${projectId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       // console.log("response", response.data.data);
//       setHomeParameters(response.data.data);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching home parameters:", error);
//       return null;
//     }
//   };

//   const openinForm = (project) => {
//     const projectId = project._id;

//     const fetchDataAndNavigate = async () => {
//       try {
//         const projectResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/layout/api/v1/layout/${projectId}`,
//           {
//             withCredentials: true,
//           }
//         );
//         setProjects(projectResponse.data);

//         const homeParams = await getHomeParameters(projectId); 
//         if (homeParams) {
//           navigate("/dashboard/layout-form", { state: { layout: homeParams } });
//         }
//       } catch (error) {
//         console.error("Error in openinForm:", error);
//       }
//     };

//     fetchDataAndNavigate();
//   };

//   const deletetheCard = async (projectId) => {
//     try {
//       await axios.delete(
//         `${
//           import.meta.env.VITE_API_URL
//         }/layout/api/v1/delete-layout/${projectId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       setData(data.filter((proj) => proj._id !== projectId));
//       toast.success("Project deleted successfully!");
//       // alert("Project deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting project:", error);
//       toast.error("Failed to delete project.");
//       // alert("Failed to delete project.");
//     }
//   };

//   const handleDelete = (projectId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this project?"
//     );
//     if (confirmDelete) {
//       deletetheCard(projectId);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <header className="mb-8 flex items-center gap-3 border-b border-gray-300 pb-4">
//         <Box size={32} className="text-blue-600" />
//         <h2 className="text-3xl font-bold text-gray-900 select-none">
//           My Projects
//         </h2>
//       </header>
//       <p className="mb-8 text-gray-700 max-w-xl leading-relaxed">
//         Explore your saved projects below. Click on the buttons to view detailed
//         2D or 3D previews.
//       </p>

//       <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {data.length !== 0 ? (
//           data.map((proj) => (
//             <ProjectCard
//               key={proj.id || proj._id}
//               name={proj.name}
//               description={proj.description}
//               openinForm={() => openinForm(proj)}
//               deletetheCard={() => handleDelete(proj._id)}
//             />
//           ))
//         ) : (
//           <div className="col-span-3 text-center text-gray-500">
//             <p>No projects found. Start creating your first layout!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;

import React, { useEffect, useState } from "react";
import { LayoutList, Box, Eye, Cuboid, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProjectCard = ({ name, description, openinForm, deletetheCard }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <LayoutList size={20} className="text-blue-600" /> {name}
      </h3>
      <p className="text-gray-600 whitespace-pre-wrap">
        {description || "No description provided."}
      </p>
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={openinForm}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[#172a91] hover:bg-[#151e60] text-white font-semibold py-2 rounded transition"
          aria-label={`View in form of ${name}`}
        >
          <Eye size={16} /> Open
        </button>
        <button
          onClick={deletetheCard}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
          aria-label={`Delete project ${name}`}
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-medium">"{projectName}"</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [homeParameters, setHomeParameters] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectNameToDelete, setProjectNameToDelete] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/layout/api/v1/all-layout`,
          {
            withCredentials: true,
          }
        );
        setData(res.data.layouts);
      } catch (error) {
        toast.error("Error fetching projects");
        console.error("Error fetching projects:", error);
      }
    };

    getProjects();
  }, []);

  const getHomeParameters = async (projectId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/layout/api/v1/home-parameters/${projectId}`,
        {
          withCredentials: true,
        }
      );
      setHomeParameters(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching home parameters:", error);
      return null;
    }
  };

  const openinForm = (project) => {
    const projectId = project._id;

    const fetchDataAndNavigate = async () => {
      try {
        const projectResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/layout/api/v1/layout/${projectId}`,
          {
            withCredentials: true,
          }
        );
        setProjects(projectResponse.data);

        const homeParams = await getHomeParameters(projectId); 
        if (homeParams) {
          navigate("/dashboard/layout-form", { state: { layout: homeParams } });
        }
      } catch (error) {
        console.error("Error in openinForm:", error);
      }
    };

    fetchDataAndNavigate();
  };

  const deletetheCard = async (projectId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/layout/api/v1/delete-layout/${projectId}`,
        {
          withCredentials: true,
        }
      );
      setData(data.filter((proj) => proj._id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteClick = (projectId, projectName) => {
    setProjectToDelete(projectId);
    setProjectNameToDelete(projectName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deletetheCard(projectToDelete);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
    setProjectNameToDelete("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        projectName={projectNameToDelete}
      />

      <header className="mb-8 flex items-center gap-3 border-b border-gray-300 pb-4">
        <Box size={32} className="text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900 select-none">
          My Projects
        </h2>
      </header>
      <p className="mb-8 text-gray-700 max-w-xl leading-relaxed">
        Explore your saved projects below. Click on the buttons to view detailed
        2D or 3D previews.
      </p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.length !== 0 ? (
          data.map((proj) => (
            <ProjectCard
              key={proj.id || proj._id}
              name={proj.name}
              description={proj.description}
              openinForm={() => openinForm(proj)}
              deletetheCard={() => handleDeleteClick(proj._id, proj.name)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            <p>No projects found. Start creating your first layout!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;