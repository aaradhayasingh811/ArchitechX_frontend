import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import html2canvas from "html2canvas";

const API_URL = "http://localhost:3002/api/v1/create-layout";

const HouseLayoutEditor = ({ data, onSave }) => {
  const [layout, setLayout] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("My House Project");
  const [projectDescription, setProjectDescription] = useState("");
  const [isEditingProjectInfo, setIsEditingProjectInfo] = useState(false);
  const [activeTool, setActiveTool] = useState("select");
  const [savedProjects, setSavedProjects] = useState([]);
  const layoutRef = useRef(null);

  useEffect(() => {
    axios
      .post(API_URL, data)
      .then((response) => {
        const layoutData = response.data.layout;
        setLayout(layoutData);

        const initialFurniture = layoutData.rooms.map((room) => ({
          roomName: room.name,
          items: [],
        }));
        setFurnitureItems(initialFurniture);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch layout: " + err.message);
        console.error(err);
      });
  }, [data]);

  const handleRoomHover = (room) => {
    setHoveredRoom(room);
  };

  const handleRoomClick = (room, e) => {
    setSelectedRoom(room);

    if (activeTool === "place" && selectedFurniture) {
      // Calculate position relative to the room
      const roomRect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - roomRect.left;
      const clickY = e.clientY - roomRect.top;

      // Convert to percentage coordinates within the room
      const xPercent = (clickX / roomRect.width) * 100;
      const yPercent = (clickY / roomRect.height) * 100;

      handleDropFurniture(
        room.name,
        { ...selectedFurniture },
        { x: xPercent, y: yPercent }
      );
    }
  };

  const applyColorToRoom = () => {
    if (!selectedRoom || !selectedColor) return;

    setLayout((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.name === selectedRoom.name
          ? { ...room, color: selectedColor }
          : room
      ),
    }));
  };

  const handleDropFurniture = (roomName, item, position = null) => {
    if (item.action === "move") {
      setFurnitureItems((prev) =>
        prev
          .map((room) => {
            if (room.items.some((i) => i.id === item.id)) {
              return {
                ...room,
                items: room.items.filter((i) => i.id !== item.id),
              };
            }
            return room;
          })
          .map((room) =>
            room.roomName === roomName
              ? {
                  ...room,
                  items: [
                    ...room.items,
                    {
                      ...item,
                      action: undefined,
                      x: position ? position.x : item.x || Math.random() * 60,
                      y: position ? position.y : item.y || Math.random() * 60,
                    },
                  ],
                }
              : room
          )
      );
    } else {
      setFurnitureItems((prev) =>
        prev.map((room) =>
          room.roomName === roomName
            ? {
                ...room,
                items: [
                  ...room.items,
                  {
                    ...item,
                    id: Date.now() + Math.random(),
                    x: position ? position.x : Math.random() * 60,
                    y: position ? position.y : Math.random() * 60,
                  },
                ],
              }
            : room
        )
      );
    }
  };

  const removeFurnitureItem = (roomName, itemId) => {
    setFurnitureItems((prev) =>
      prev.map((room) =>
        room.roomName === roomName
          ? { ...room, items: room.items.filter((item) => item.id !== itemId) }
          : room
      )
    );
  };

  const deleteSelectedFurniture = () => {
    if (!selectedFurniture || !selectedFurniture.id) return;

    setFurnitureItems((prev) =>
      prev.map((room) => ({
        ...room,
        items: room.items.filter((item) => item.id !== selectedFurniture.id),
      }))
    );
    setSelectedFurniture(null);
  };

  const exportAsPNG = () => {
    if (!layoutRef.current) return;

    html2canvas(layoutRef.current, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${projectName || "layout"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const saveProject = async () => {
    if (!projectName.trim() || !layout) return;
    try {
      const payload = {
        name: projectName,
        description: projectDescription.trim() || "No description provided",
        boundaries: layout.boundaries,
        rooms: layout.rooms,
        furniture: furnitureItems,
      };

      console.log("Saving project:", payload);

      const response = await axios.post(
        "http://localhost:3002/api/v1/save-layout",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Layout saved:", response.data);
      setSavedProjects([
        ...savedProjects,
        { name: projectName, layout: layout },
      ]);
      alert("Layout saved successfully!");
      setIsEditingProjectInfo(false);
    } catch (err) {
      console.error("Failed to save layout:", err);
      alert("Error saving layout. Please try again.");
    }
  };

  if (!layout) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading layout...
      </div>
    );
  }

  const maxWidth = 800;
  const maxHeight = 600;
  const scaleX = maxWidth / layout.boundaries.width;
  const scaleY = maxHeight / layout.boundaries.height;
  const scale = Math.min(scaleX, scaleY);

  const availableFurniture = [
    { id: 1, name: "Bed", type: "bed", width: 5, height: 7, color: "#8B4513" },
    {
      id: 2,
      name: "Sofa",
      type: "sofa",
      width: 6,
      height: 3,
      color: "#FF6347",
    },
    {
      id: 3,
      name: "Table",
      type: "table",
      width: 4,
      height: 4,
      color: "#D2B48C",
    },
    {
      id: 4,
      name: "Chair",
      type: "chair",
      width: 2,
      height: 2,
      color: "#A0522D",
    },
    {
      id: 5,
      name: "Cabinet",
      type: "cabinet",
      width: 3,
      height: 6,
      color: "#696969",
    },
    { id: 6, name: "TV", type: "tv", width: 4, height: 2, color: "#000000" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">2D House Layout Editor</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditingProjectInfo(true)}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
            >
              Project Info
            </button>
            <button
              onClick={exportAsPNG}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Export as PNG
            </button>
          </div>
        </div>

        {isEditingProjectInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Project Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingProjectInfo(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Furniture Toolbar */}
          <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Tools</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    activeTool === "select"
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveTool("select")}
                >
                  Select
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    activeTool === "delete"
                      ? "bg-red-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveTool("delete")}
                >
                  Delete
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    activeTool === "place"
                      ? "bg-green-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setActiveTool("place")}
                >
                  Place
                </button>
              </div>
              {activeTool === "delete" && selectedFurniture && (
                <button
                  onClick={deleteSelectedFurniture}
                  className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete Selected
                </button>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4">Furniture</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableFurniture.map((item) => (
                <FurnitureItem
                  key={item.id}
                  item={item}
                  onSelect={() => {
                    setSelectedFurniture(item);
                    setActiveTool("place");
                  }}
                  isSelected={selectedFurniture?.id === item.id}
                />
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Room Color</h2>
              <div className="flex flex-wrap gap-2">
                {[
                   "#E0E0E0",
  "#B0BEC5",
  "#90A4AE",
  "#789262",
  "#A1887F",
  "#D7CCC8",
  "#F5F5F5",
  "#FFE0B2",
  "#FFCCBC",
  "#C5E1A5",
  "#AED581",
  "#81D4FA",
  "#4DD0E1",
  "#B39DDB",
  "#CE93D8"
                ].map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      selectedColor === color
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={applyColorToRoom}
                disabled={!selectedRoom}
              >
                Apply Color
              </button>
            </div>

            {selectedRoom && (
              <div className="mt-8 p-4 bg-white rounded-lg">
                <h3 className="font-semibold">{selectedRoom.name}</h3>
                <p>Area: {selectedRoom.area} sq units</p>
                <p>
                  Dimensions: {Math.abs(selectedRoom.x2 - selectedRoom.x1)} x{" "}
                  {Math.abs(selectedRoom.y2 - selectedRoom.y1)}
                </p>
              </div>
            )}
          </div>

          {/* Main Layout Area */}
          <div className="flex-1 p-8 overflow-auto">
            <div
              ref={layoutRef}
              className="relative border-2 border-gray-400 bg-white"
              style={{
                width: `${layout.boundaries.width * scale}px`,
                height: `${layout.boundaries.height * scale}px`,
              }}
            >
              {layout.rooms.map((room) => {
                const width = Math.abs(room.x2 - room.x1) * scale;
                const height = Math.abs(room.y2 - room.y1) * scale;
                const left = Math.min(room.x1, room.x2) * scale;
                const top = Math.min(room.y1, room.y2) * scale;

                const roomFurniture =
                  furnitureItems.find((f) => f.roomName === room.name)?.items ||
                  [];

                return (
                  <Room
                    key={room.name}
                    room={room}
                    width={width}
                    height={height}
                    left={left}
                    top={top}
                    scale={scale}
                    onHover={handleRoomHover}
                    onClick={handleRoomClick}
                    isHovered={hoveredRoom?.name === room.name}
                    isSelected={selectedRoom?.name === room.name}
                    furnitureItems={roomFurniture}
                    onDropFurniture={(item) =>
                      handleDropFurniture(room.name, item)
                    }
                    onRemoveFurniture={(itemId) =>
                      removeFurnitureItem(room.name, itemId)
                    }
                    activeTool={activeTool}
                    selectedFurniture={selectedFurniture}
                    setSelectedFurniture={setSelectedFurniture}
                    allRooms={layout.rooms}
                  />
                );
              })}
            </div>

            {hoveredRoom && (
              <div className="mt-4 p-3 bg-gray-800 text-white rounded-lg">
                <h3 className="font-bold">{hoveredRoom.name}</h3>
                <p>Area: {hoveredRoom.area} sq units</p>
                <p>
                  Dimensions:{" "}
                  {Math.abs(hoveredRoom.x2 - hoveredRoom.x1).toFixed(2)} x{" "}
                  {Math.abs(hoveredRoom.y2 - hoveredRoom.y1).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const Room = ({
  room,
  width,
  height,
  left,
  top,
  scale,
  onHover,
  onClick,
  isHovered,
  isSelected,
  furnitureItems,
  onDropFurniture,
  onRemoveFurniture,
  activeTool,
  selectedFurniture,
  setSelectedFurniture,
  allRooms,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["furniture", "furniture-in-room"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const boundingRect = monitor.getBoundingClientRect();

      if (offset && boundingRect) {
        const x = ((offset.x - boundingRect.left) / boundingRect.width) * 100;
        const y = ((offset.y - boundingRect.top) / boundingRect.height) * 100;

        onDropFurniture({
          ...item,
          x: Math.max(0, Math.min(95, x)),
          y: Math.max(0, Math.min(95, y)),
        });
      } else {
        onDropFurniture(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let roomColor = room.color || "#FFFFFF";
  if (isHovered) roomColor = lightenColor(roomColor, 20);
  if (isSelected) roomColor = lightenColor(roomColor, 10);

  // Generate doors for rooms adjacent to corridor
  const doors = [];
  const corridor = allRooms.find((r) => r.name === "Corridor");

  if (corridor && room.name !== "Corridor") {
    const sharedWall = findSharedWall(room, corridor);

    if (sharedWall) {
      const doorWidth = 4;
      const doorHeight = 10;

      let doorX, doorY;

      if (sharedWall.side === "top" || sharedWall.side === "bottom") {
        const wallCenter = (sharedWall.start + sharedWall.end) / 2;
        doorX = wallCenter * scale - doorWidth / 2;
        doorY =
          sharedWall.side === "top"
            ? room.y1 * scale - doorHeight / 2
            : room.y2 * scale - doorHeight / 2;
      } else {
        const wallCenter = (sharedWall.start + sharedWall.end) / 2;
        doorY = wallCenter * scale - doorHeight / 2;
        doorX =
          sharedWall.side === "left"
            ? room.x1 * scale - doorWidth / 2
            : room.x2 * scale - doorWidth / 2;
      }

      doors.push({
        x: doorX,
        y: doorY,
        width: doorWidth,
        height: doorHeight,
        direction:
          sharedWall.side === "left"
            ? "right"
            : sharedWall.side === "right"
            ? "left"
            : sharedWall.side === "top"
            ? "bottom"
            : "top",
      });
    }
  }

  const isStaircase = room.name === "Staircase";

  const handleFurnitureClick = (item, e) => {
    e.stopPropagation();
    if (activeTool === "select") {
      setSelectedFurniture(item);
    } else if (activeTool === "delete") {
      onRemoveFurniture(item.id);
    }
  };

  return (
    <div
      ref={drop}
      className={`absolute border border-gray-700 flex flex-col items-center justify-center transition-all duration-200 ${
        isOver ? "bg-opacity-70" : ""
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        backgroundColor: roomColor,
        zIndex: isHovered || isSelected ? 10 : 1,
        transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
        boxShadow: isHovered ? "0 10px 20px rgba(0,0,0,0.2)" : "none",
      }}
      onMouseEnter={() => onHover(room)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => onClick(room, e)}
    >
      {isStaircase && (
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 border-t border-gray-400"
              style={{
                height: `${100 / 6}%`,
                transform: `perspective(100px) rotateX(${i * 5}deg)`,
                boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      )}

      <span className="text-xs font-semibold text-center px-1 bg-white bg-opacity-70 rounded">
        {room.name}
      </span>

      {doors.map((door, i) => (
        <div
          key={i}
          className="absolute bg-brown-800"
          style={{
            left: `${door.x - left}px`,
            top: `${door.y - top}px`,
            width: `${door.width}px`,
            height: `${door.height}px`,
            backgroundColor: "#8B4513",
            zIndex: 2,
            transform:
              door.direction === "right"
                ? "perspective(100px) rotateY(30deg)"
                : door.direction === "left"
                ? "perspective(100px) rotateY(-30deg)"
                : door.direction === "bottom"
                ? "perspective(100px) rotateX(30deg)"
                : "perspective(100px) rotateX(-30deg)",
          }}
        />
      ))}

      {furnitureItems.map((item) => (
        <FurnitureInRoom
          key={item.id}
          item={item}
          roomLeft={left}
          roomTop={top}
          scale={scale}
          onClick={(e) => handleFurnitureClick(item, e)}
          isSelected={selectedFurniture?.id === item.id}
        />
      ))}
    </div>
  );
};

const FurnitureItem = ({ item, onSelect, isSelected }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "furniture",
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 border rounded-lg cursor-move flex flex-col items-center ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={onSelect}
    >
      <div
        className="mb-1"
        style={{
          width: `${item.width * 5}px`,
          height: `${item.height * 5}px`,
          backgroundColor: item.color,
          border: "1px solid #333",
        }}
      />
      <span className="text-xs">{item.name}</span>
    </div>
  );
};

const FurnitureInRoom = ({
  item,
  roomLeft,
  roomTop,
  scale,
  onClick,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "furniture-in-room",
    item: { ...item, action: "move" },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`absolute cursor-move border-2 flex items-center justify-center ${
        isSelected ? "border-yellow-400" : "border-gray-700"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{
        width: `${item.width * scale}px`,
        height: `${item.height * scale}px`,
        backgroundColor: item.color,
        left: `${item.x || Math.random() * 60}%`,
        top: `${item.y || Math.random() * 60}%`,
        zIndex: 5,
      }}
      onClick={onClick}
      title={`${item.name} (Click to select, Delete tool to remove)`}
    >
      <span className="text-xs text-white text-shadow">{item.name}</span>
    </div>
  );
};

function findSharedWall(room1, room2) {
  const r1 = {
    left: Math.min(room1.x1, room1.x2),
    right: Math.max(room1.x1, room1.x2),
    top: Math.min(room1.y1, room1.y2),
    bottom: Math.max(room1.y1, room1.y2),
  };

  const r2 = {
    left: Math.min(room2.x1, room2.x2),
    right: Math.max(room2.x1, room2.x2),
    top: Math.min(room2.y1, room2.y2),
    bottom: Math.max(room2.y1, room2.y2),
  };

  // Check for vertical shared walls (left/right)
  if (Math.abs(r1.left - r2.right) < 0.1) {
    // room1 left touches room2 right
    const overlapTop = Math.max(r1.top, r2.top);
    const overlapBottom = Math.min(r1.bottom, r2.bottom);
    if (overlapBottom > overlapTop) {
      return {
        side: "left",
        start: overlapTop,
        end: overlapBottom,
      };
    }
  } else if (Math.abs(r1.right - r2.left) < 0.1) {
    // room1 right touches room2 left
    const overlapTop = Math.max(r1.top, r2.top);
    const overlapBottom = Math.min(r1.bottom, r2.bottom);
    if (overlapBottom > overlapTop) {
      return {
        side: "right",
        start: overlapTop,
        end: overlapBottom,
      };
    }
  }

  // Check for horizontal shared walls (top/bottom)
  if (Math.abs(r1.top - r2.bottom) < 0.1) {
    // room1 top touches room2 bottom
    const overlapLeft = Math.max(r1.left, r2.left);
    const overlapRight = Math.min(r1.right, r2.right);
    if (overlapRight > overlapLeft) {
      return {
        side: "top",
        start: overlapLeft,
        end: overlapRight,
      };
    }
  } else if (Math.abs(r1.bottom - r2.top) < 0.1) {
    // room1 bottom touches room2 top
    const overlapLeft = Math.max(r1.left, r2.left);
    const overlapRight = Math.min(r1.right, r2.right);
    if (overlapRight > overlapLeft) {
      return {
        side: "bottom",
        start: overlapLeft,
        end: overlapRight,
      };
    }
  }

  return null;
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

export default HouseLayoutEditor;
