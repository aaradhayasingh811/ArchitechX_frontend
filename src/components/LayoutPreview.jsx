import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Save, Ruler, Info, FolderPlus, RotateCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://localhost:3002/api/v1/create-layout";

const LayoutPreview = ({ data }) => {
  const navigation = useNavigate();
  const [layoutData, setLayoutData] = useState(null);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [rotation, setRotation] = useState(0);
  const svgRef = useRef(null);

  useEffect(() => {
    axios.post(API_URL, data)
      .then(response => setLayoutData(response.data.layout))
      .catch(() => setError('Failed to fetch layout'));
  }, [data]);

  const handleSaveProject = async () => {
    if (!projectName.trim() || !layoutData) return;

    try {
      const payload = {
        name: projectName,
        description: description.trim() || 'No description provided',
        boundaries: layoutData.boundaries,
        rooms: layoutData.rooms,
      };

      console.log(payload);

      const response = await axios.post("http://localhost:3002/api/v1/save-layout", payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Layout saved:", response.data);
      setSavedProjects([...savedProjects, { name: projectName, layout: layoutData }]);
      setProjectName('');
      setDescription('');
      alert("Layout saved successfully!");
      navigation('/dashboard/projects'); 

    } catch (err) {
      console.error("Failed to save layout:", err);
      alert("Error saving layout. Please try again.");
    }
  };

  const handleExport = () => {
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = svgElement.clientWidth * scale;
    canvas.height = svgElement.clientHeight * scale;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'layout.png';
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const toggleRotation = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!layoutData) return <div className="text-center mt-10 text-gray-500">Loading layout...</div>;

  const { boundaries, rooms } = layoutData;
  const scale = 30;
  const viewBoxWidth = boundaries.width * scale;
  const viewBoxHeight = boundaries.height * scale;

  const parkingRoom = rooms.find(r => r.name.toLowerCase() === 'parking');

  return (
    <div className="flex flex-col lg:flex-row md:p-6 gap-6 w-full">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-gray-100 md:p-4 rounded-xl shadow-md space-y-6">
        {/* Save Project */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><FolderPlus size={18} /> Save Project</h2>
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Enter description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2 resize-none"
            rows={3}
          />
          <button
            onClick={handleSaveProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showMeasurements}
              onChange={() => setShowMeasurements(!showMeasurements)}
            />
            Show Measurements
          </label>

          <button
            onClick={toggleRotation}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
          >
            <RotateCw size={18} /> Rotate Layout
          </button>

          <button
            onClick={handleExport}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
          >
            <Download size={18} /> Export PNG
          </button>
        </div>

        <div className="text-sm text-gray-700 bg-white p-3 rounded shadow">
          <p className="font-medium">Note:</p>
          <p>The white area on the left side is reserved as an open space for seating and a children's play area.</p>
        </div>
      </div>

      {/* Layout Viewer */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded-lg shadow-lg bg-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          width="100%"
          height="auto"
          className="block"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
          role="img"
          aria-label="2D home layout"
        >
          {rooms.map((room, index) => {
            const x = room.x1 * scale;
            const y = room.y1 * scale;
            const width = (room.x2 - room.x1) * scale;
            const height = (room.y2 - room.y1) * scale;

            return (
              <g key={index}>
                <title>
                  {room.name} | Area: {room.area} m² | ({room.x1}, {room.y1}) → ({room.x2}, {room.y2})
                </title>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={`hsl(${(index * 45) % 360}, 70%, 80%)`}
                  stroke="#333"
                  strokeWidth={1}
                  className="transition-colors duration-300 hover:fill-opacity-75"
                  rx={4}
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={Math.min(15, width / 5)}
                  className="fill-gray-800 font-semibold select-none pointer-events-none"
                >
                  {room.name}
                </text>
                {showMeasurements && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 16}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={10}
                    className="fill-gray-600 select-none pointer-events-none"
                  >
                    {room.area} m²
                  </text>
                )}
              </g>
            );
          })}

          {/* Gate in front of parking */}
          {parkingRoom && (
            <g key="parking-gate">
              <rect
                x={parkingRoom.x1 }
                y={(parkingRoom.y2 ) - 3}
                width={(parkingRoom.x2 - parkingRoom.x1) * scale}
                height={6}
                fill="none"
                stroke="black"
                strokeWidth={2}
                strokeDasharray="6 3"
              />
              <text
                x={(parkingRoom.x1 + parkingRoom.x2) / 2 * scale}
                y={parkingRoom.y2  + 25}
                textAnchor="middle"
                fontSize={20}
                className="fill-gray-700"
              >
                Main Gate
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default LayoutPreview;
