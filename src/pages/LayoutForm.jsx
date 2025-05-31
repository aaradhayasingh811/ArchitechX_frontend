import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LayoutPreview from "../components/LayoutPreview";
import Layout3D from "../components/Layout3D";
import generateRooms from "../utils/authUtils";
import HouseLayoutEditor from "../components/HouseLayoutEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback } from "react";

const LayoutForm = () => {
  const location = useLocation();
  const incomingData = location?.state?.layout?.data;

  const [formData, setFormData] = useState({
    width: "",
    height: "",
    master_rooms: "",
    bathrooms: "",
    cars: "",
    bikes: "",
  });

  useEffect(() => {
    if (incomingData) {
      setFormData({
        width: incomingData.width || "",
        height: incomingData.height || "",
        master_rooms: incomingData.master_rooms || "",
        bathrooms: incomingData.bathrooms || "",
        cars: incomingData.cars || "",
        bikes: incomingData.bikes || "",
      });
    }
  }, [incomingData]);

  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("form");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setView("2d");
    console.log("Form data:", formData);
  };

  const open3D = () => {
    setRooms(generateRooms(formData));
    setView("3d");
  };

  const backToForm = useCallback(() => {
    setView("form");
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className="max-w-7xl mx-auto">
        {view === "2d" ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* <div className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">2D Layout Editor</h2>
              <p className="text-gray-600 mt-1">Drag and drop to customize your layout</p>
            </div> */}
            <DndProvider backend={HTML5Backend}>
              <HouseLayoutEditor data={formData} />
            </DndProvider>
           <button
                onClick={backToForm}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm m-4"
              >
                Back to Form
              </button>
          </div>
        ) : view === "3d" ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">3D Layout Visualization</h2>
              <p className="text-gray-600 mt-1">Explore your property in 3D</p>
            </div>
            <div className="p-4">
              <Layout3D data={formData} />
               <button
                onClick={backToForm}
                className="px-6 m-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm cursor-pointer"
              >
                Back to Form
              </button>
            </div>
           
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Property Layout Designer</h1>
                <p className="mt-2 text-gray-600">
                  Enter your property details to generate 2D and 3D layouts
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Width (in feet)"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Height (in feet)"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Master Bedrooms"
                    name="master_rooms"
                    value={formData.master_rooms}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Car Parking Spaces"
                    name="cars"
                    value={formData.cars}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Bike Parking Spaces"
                    name="bikes"
                    value={formData.bikes}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Generate 2D Layout
                  </button>

                  <button
                    type="button"
                    onClick={open3D}
                    className="flex-1 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View 3D Layout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <input
        type="number"
        id={name}
        name={name}
        min="0"
        value={value}
        onChange={onChange}
        required
        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
      />
    </div>
  </div>
);

export default LayoutForm;