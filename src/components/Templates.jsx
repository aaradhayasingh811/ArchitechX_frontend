import React, { useState, useEffect } from "react";
import {
  LayoutTemplate,
  Home,
  Layers,
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API Service Mock (would be replaced with real API calls)
const fetchTemplates = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const templateData = [
    {
      id: 1,
      name: "2BHK Apartment",
      description: "Standard 2 bedroom apartment with living room and kitchen",
      icon: "home",
      rooms: ["Living Room", "Bedroom 1", "Bedroom 2", "Kitchen", "Bathroom"],
      area: "800-1000 sq.ft",
    },
    {
      id: 2,
      name: "Duplex Villa",
      description: "Two-story villa with spacious rooms and modern amenities",
      icon: "building",
      rooms: [
        "Living Room",
        "Dining",
        "4 Bedrooms",
        "Kitchen",
        "2 Bathrooms",
        "Terrace",
      ],
      area: "2000-2500 sq.ft",
    },
    {
      id: 3,
      name: "Studio Apartment",
      description: "Compact living space combining bedroom and living area",
      icon: "layers",
      rooms: ["Studio Space", "Kitchenette", "Bathroom"],
      area: "400-600 sq.ft",
    },
    {
      id: 4,
      name: "Bungalow",
      description: "Single-story detached house with garden space",
      icon: "home",
      rooms: [
        "Living Room",
        "Dining",
        "3 Bedrooms",
        "Kitchen",
        "2 Bathrooms",
        "Garden",
      ],
      area: "1500-1800 sq.ft",
    },
  ];

  return templateData;
};

const fetchPropertyTypes = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: 1,
      type: "2BHK Apartment",
      width: "30",
      height: "40",
      master_rooms: "1",
      bathrooms: "2",
      cars: "1",
      bikes: "2",
    },
    {
      id: 3,
      type: "Studio",
      width: "20",
      height: "30",
      master_rooms: "0",
      bathrooms: "1",
      cars: "1",
      bikes: "1",
    },
    {
      id: 4,
      type: "Bungalow",
      width: "50",
      height: "60",
      master_rooms: "2",
      bathrooms: "3",
      cars: "2",
      bikes: "2",
    },
    {
      id: 2,
      type: "Duplex Villa",
      width: "60",
      height: "70",
      master_rooms: "3",
      bathrooms: "4",
      cars: "2",
      bikes: "2",
    },
  ];
};

const iconComponents = {
  home: <Home className="text-blue-500" size={24} />,
  building: <Building2 className="text-green-500" size={24} />,
  layers: <Layers className="text-purple-500" size={24} />,
};

const TemplateCard = ({ template, onSelect, isLoading, error }) => {
  const icon = iconComponents[template.icon] || (
    <Home className="text-gray-500" size={24} />
  );

  return (
    <div
      className={`border rounded-lg p-5 transition-all ${
        error
          ? "border-red-200 bg-red-50"
          : isLoading
          ? "border-gray-200 opacity-70 cursor-not-allowed"
          : "border-gray-200 hover:shadow-md cursor-pointer"
      }`}
      onClick={!isLoading && !error ? () => onSelect(template) : undefined}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-full ${error ? "bg-red-100" : "bg-gray-50"}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3
              className={`text-lg font-semibold ${
                error ? "text-red-800" : "text-gray-800"
              }`}
            >
              {template.name}
            </h3>
            {error ? (
              <AlertCircle className="text-red-500" size={18} />
            ) : isLoading ? (
              <Loader2 className="animate-spin text-gray-400" size={18} />
            ) : (
              <ArrowRight className="text-gray-400" size={18} />
            )}
          </div>

          <p className={`mt-1 ${error ? "text-red-600" : "text-gray-600"}`}>
            {error || template.description}
          </p>

          {!error && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {template.area}
              </span>
              {template.rooms.slice(0, 3).map((room) => (
                <span
                  key={room}
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                >
                  {room}
                </span>
              ))}
              {template.rooms.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  +{template.rooms.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateErrors, setTemplateErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel
        const [templatesData, propertyTypesData] = await Promise.all([
          fetchTemplates(),
          fetchPropertyTypes(),
        ]);

        setTemplates(templatesData);
        setPropertyTypes(propertyTypesData);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load templates. Please try again later.");
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTemplateSelect = async (template) => {
    try {
      setSelectedTemplate(template.id);
      setTemplateLoading(true);
      setTemplateErrors((prev) => ({ ...prev, [template.id]: null }));

      // Find matching property type
      const propertyType = propertyTypes.find((pt) => pt.id === template.id);

      if (!propertyType) {
        throw new Error(
          `Property type not found for template ${template.name}`
        );
      }

      // Simulate validation
      // if (template.id === 3) {
      //   // Simulate a failing template
      //   throw new Error("This template is currently unavailable for selection");
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(propertyType);

      toast.success(`${template.name} template selected`);
      navigate("/dashboard/layout-form", {
        state: {
          layout: {
            data: propertyType,
          },
        },
      });
    } catch (err) {
      console.error(`Error selecting template ${template.name}:`, err);
      setTemplateErrors((prev) => ({ ...prev, [template.id]: err.message }));
      toast.error(`Failed to select template: ${err.message}`);
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleStartFromScratch = () => {
    navigate("/dashboard/layout-form", {
      state: { isNewProject: true },
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="mt-4 text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <LayoutTemplate className="text-blue-600" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Project Templates
          </h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-800">
              Error Loading Templates
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutTemplate className="text-blue-600" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Project Templates
          </h2>
        </div>
        <button
          onClick={handleStartFromScratch}
          disabled={templateLoading}
          className="flex items-center gap-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Start from scratch
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Select a template to kickstart your project. Each template comes with
        pre-configured room layouts and dimensions.
      </p>

      <div className="space-y-4">
        {templates.length > 0 ? (
          templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
              isLoading={templateLoading && selectedTemplate === template.id}
              error={templateErrors[template.id]}
            />
          ))
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-blue-500 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-800">
                No Templates Available
              </h3>
              <p className="text-blue-700">
                There are currently no templates to display.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Need help choosing?
        </h3>
        <p className="text-gray-600">
          Our templates are designed by professional architects. The "2BHK
          Apartment" is our most popular choice for small families.
        </p>
      </div>
    </div>
  );
};

export default Templates;
