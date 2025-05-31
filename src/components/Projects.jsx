import React, { useEffect, useState } from "react";
import { LayoutList, Box, Eye, Cuboid } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ name, description, openinForm ,deletetheCard}) => {
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
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-[#172a91] hover:bg-[#151e60] text-white font-semibold py-2 rounded transition"
          aria-label={`Delete project ${name}`}
        >
          <Cuboid size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

const demoProjects = [
  {
    id: 1,
    name: "Modern Family Home",
    description: "A spacious 4-bedroom home with open-plan living and a large garden.",
  },
  {
    id: 2,
    name: "Urban Apartment",
    description: "Compact 2-bedroom apartment perfect for city living with great natural light.",
  },
  {
    id: 3,
    name: "Luxury Villa",
    description: "An elegant villa featuring a pool, gym, and panoramic views.",
  },
  {
    id: 4,
    name: "Tiny House",
    description: "Minimalist tiny house design with multi-functional spaces and eco-friendly materials.",
  },
  {
    id: 5,
    name: "Commercial Office Space",
    description: "Flexible office layout designed for productivity and collaboration.",
  },
];



const Projects = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [homeParameters, setHomeParameters] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/v1/all-layout");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const openinForm = (project) => {
    const projectId = project._id;
    const getProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/layout/${projectId}`);
       setProjects(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
      }
    }
    getProject();
    const getHomeParameters = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/v1/home-parameters/${projectId}`);
        setHomeParameters(response.data);
      } catch (error) {
        console.error("Error fetching home parameters:", error);
        return null;
      }
    }
    getHomeParameters();

    navigate("/dashboard/layout-form", { state: { layout: homeParameters } });
  };

  const deletetheCard = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3002/api/v1/layout/${projectId}`);
      setData(data.filter((proj) => proj._id !== projectId));
      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  }

  const handleDelete = (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      deletetheCard(projectId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8 flex items-center gap-3 border-b border-gray-300 pb-4">
        <Box size={32} className="text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900 select-none">My Projects</h2>
      </header>
      <p className="mb-8 text-gray-700 max-w-xl leading-relaxed">
        Explore your saved projects below. Click on the buttons to view detailed 2D or 3D previews.
      </p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(data.length > 0 ? data : demoProjects).map((proj) => (
          <ProjectCard
            key={proj.id || proj._id}
            name={proj.name}
            description={proj.description}
            openinForm={() => openinForm(proj)}
            deletetheCard={() => handleDelete(proj._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
