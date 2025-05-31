import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const CreateNewProject = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    // Navigate to LayoutForm or Editor with blank layout
    navigate("/dashboard/layout-form"); // Adjust route if needed
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow text-center">
      <h2 className="text-3xl font-bold mb-6">Create a New Project</h2>
      <p className="mb-6 text-gray-600">
        Start designing your dream home by creating a new layout project.
      </p>
      <button
        onClick={handleCreate}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold transition"
      >
        <PlusCircle size={24} />
        Create New Project
      </button>
    </div>
  );
};

export default CreateNewProject;
