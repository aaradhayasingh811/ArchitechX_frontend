import React from "react";

const Sidebar = ({ wallColor, setWallColor, cameraView, setCameraView }) => {
  return (
    <aside className="w-72 bg-white shadow-lg h-full overflow-y-auto p-6 space-y-8 text-gray-800">
      {/* 1. Tools / Modes Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="tools">🔧</span> Tools / Modes
        </h3>
        <div className="space-y-2">
          {[
            "Select Tool – For selecting and moving items (walls, furniture)",
            "Draw Walls – Freehand or grid-based layout",
            "Add Room – Insert a predefined room (kitchen, bedroom, etc.)",
            "Measure Tool – View distances between elements",
            "Eraser – Remove elements",
          ].map((tool, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            >
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="text-sm">{tool}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 2. Design & Styling Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="paint">🎨</span> Design & Styling
        </h3>
        <div className="space-y-4 text-sm">
          {/* Wall Color Picker */}
          <div>
            <label className="block font-medium mb-1" htmlFor="wallColor">
              Wall Color Picker
            </label>
            <input
              type="color"
              id="wallColor"
              value={wallColor}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
            <button
              className="text-sm text-blue-600 mt-1 underline"
              onClick={() => setWallColor("")}
            >
              Reset to default
            </button>
          </div>

          {/* Camera View */}
          <div>
            <label className="block font-medium mb-1" htmlFor="cameraView">
              Camera View
            </label>
            <select
              id="cameraView"
              value={cameraView}
              onChange={(e) => setCameraView(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="top">Top</option>
              <option value="isometric">Isometric</option>
              <option value="freeRotate">Free Rotate</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Preview Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="preview">👁️</span> Preview Settings
        </h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span>Show Measurements</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span>Enable Shadows</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span>Wireframe Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span>Grid Overlay</span>
          </label>
        </div>
      </section>

      {/* 4. Export Options */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="export">📤</span> Export Options
        </h3>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Export as PNG
          </button>
          <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition">
            Export as SVG
          </button>
        </div>
      </section>

      {/* 5. Help & Info */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="info">ℹ️</span> Help & Info
        </h3>
        <div className="text-sm space-y-2">
          <p>Hover over rooms to see details.</p>
          <p>Use mouse to rotate and zoom the layout.</p>
          <p>Designed with 🛠️ by your architectural assistant.</p>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
