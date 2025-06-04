import React, { useEffect, useState, useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";
import { Pane } from "tweakpane";
import html2canvas from "html2canvas";
import { useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import FirstPersonControls from "./FirstPersonControls";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// const API_URL = "http://localhost:3002/api/v1/create-layout";
const API_URL = `${import.meta.env.VITE_API_URL}/layout/api/v1/create-layout`;
const ROOM_HEIGHT = 6;
const WALL_THICKNESS = 0.1;
const DOOR_HEIGHT = 3;
const DOOR_WIDTH = 0.8;
// At the top of the file
THREE.Cache.enabled = true;

const FLOOR_MATERIALS = [
  {
    id: "grey1",
    name: "Grey Floor",
    textureUrl:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw0PDw8NDw0PDQ0NDQ0NDQ8NDQ0NFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNyg5OjcBCgoKDQ0NDg0NDysZFRktKysrNzcrNzctKystKysrKy0rKystKy0rLTcrKysrKysrKysrKysrKysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAABAAIDBf/EABoQAQEBAQEBAQAAAAAAAAAAAAABEQISAyH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQMC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwDw5CYfLRyy1IZDgMnDjUgjMhxqcnAZw40QZkOHCDOGQ2EBgxpWAxikaw4AWFYDOCxvFYDGLGsOAxixrFAYsGOmLAcsUdJBef0GbWNdOuWbyDnQ15ZsFKUiBSNQ8xrBBIZDzGvIM+TI0JAUWGNYDMixrFgMwlYDJWEFFSsUGJGAQYgGKlUGZFYYgZw4cWAycKQYxY0sAWMVus2AxWW7GcBJIBy6Rz5dIBajLUBVQqAJCSoEcQBJAlViBYooQAaAKFQwEEgIQApRAkkDKiGoGstWsmgZxtmgziSAcRtnhuUDCIYBS1YoZSDKCqWoEkgCKgLEiAiRAEQ0AkgSRAGggEjQYGFAEaKgzWTRQCFQHhqM/NoGiGgBiIAgqIiwgkiCoIBakoCKiAFIEiqDKKAJICgQYpSAVmtCoMUNWDAc9KxAvm3HPh0gNRqMmAYQlE1GWgSSBGCUgWWgAOJAQQCLJA6ggSWgEkYCSQMlABUqqgzWa3WKDKWIGOHTGeW9AxqRmNSgUogREKhQIGIQgCEBSQKIigkNIHAQCowoAUgSSoMogENVCCrPTVFBzSQDlpnlqA1CJTAJBoDSI0BC1KFJAkqIBlLJgFJACCBCAFJACEBBABVIAsOABWOqeqx1UEgQHLbHLcBNQGASEBhZ06CISjUQNoIJaBQ0gVVEAKQJAgFEgVS0QChqBEDQVoVCArFjdYtBJnSA5dI58twGtLMIEggkggdQKhIShCSCMGpRrVrKBpMnQKGi0GhrOrUGrUyijVQ0KLUBqDVZqABnpq1igkEKeadc+a1ojcp1zalBvTrB0GizqBqJjVoOmrWNWg2qzaLQa0saQaWs6tBrRoGg1qGjQaFGjqg1p1zjUoNLWdWgdVY06BXTI0FQgAtQQo5NSBStSpA1KtSEOpIAdSAxaEA9HUgWnQgK0IDaLUgGnUgQ0oEkgOhIGdKQBJANCQrKSB//2Q==",
    roughness: 0.5,
    metalness: 0.0,
    repeat: [4, 4],
  },
  {
    id: "wood1",
    name: "Wooden Floor",
    textureUrl: "https://threejs.org/examples/textures/hardwood2_diffuse.jpg",
    roughness: 0.3,
    metalness: 0.0,
    repeat: [4, 4],
  },
  {
    id: "tiles1",
    name: "White Tiles",
    textureUrl:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUXFxUXFRUVFRUVFxUXFRUXFxUVFRUYHSggGB0lHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NDg0NDjcZFRktKys3Ky0rLSsrLS0tKysrLS0tKys3Ky0rLSstKys3LS0rKy0tKysrKzcrLSsrLS0rLf/AABEIAOAA4AMBIgACEQEDEQH/xAAZAAEBAQEBAQAAAAAAAAAAAAABAAIDBAf/xAAxEAEBAAIABAUCAwcFAAAAAAAAAQIRAwRSkhMhMnKzEhQiMZFBUVNhcYHRQnOhseH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7BWb5N6ViNMtX8lD9IM41tmRoBIVUCW1tnIG4FiRAdpWCvNyXpvv4vy5vQ48j6b7+L8ubtYIGWtDQo2UgUrUrJgBnLybWQMfUYsp5GwFQqhGmWhRRtqeQtEAjag2DWIyqgv8AL8wKmIlalAynTLUEMh2ozAcOSv4b7+L8ubttw5P03/c4vy5uoHaCFSRQS2NbMBWraakUUi2RkIzcWbHQUDYtCkUaEjWhQYzjNdZWbNgJYNMXyrpAGJYyvm1sGpGsWG8YDWQhkIjy8n6b7+L8ubtXDk/TffxflzdxQtNSK0BsbVUQRNgUJiANDKbUNgjnh5eX826xw5rf/DYJQEU7FiQDTOTW3O7BiTVdNC4681MoA21iMf3N4wGsY1II0IqxtWgHn5P0338X5c3pjhyXpvv4vy5u9FTCsOgUW1tnQNjSjWgCkRgKU7ZqEWc2Jv8AJRaAtaYxya2KqlsWAzlWPqq42etQY+fkCxv7P1/8bmDUaxBj6dKU5USA6xVYoQAoV5uR9N9/F+XN3rjyPpvv4vy5u2QCIQoBaRihkNqQMnaMAM5VrKsyAtJ0jNgOeV8ztrXmJAEiyzp/Ji3QM5z9urWuF+/9i/6dNgJ5U2iGQDEbBIIZWtsNUUsmiCOHJem+/i/Lm65OXJem+/i/Lm7UVnTQ0YAkK0qCOhCDK2qtgchiTACMgtEFW3LLjY79WP6z/KnHw68e6Cuin7nOcbDqx7o14+HXj3QG7DI53j4dePdF4+HXj3QG9GRz8fDrx7oZx8OvHugjrBpjx8OvHun+V9xh1490Boufj4dWPdGfuMOvHugrsnO8xh1490Hj4dePdAY5L0338X5c3fbx8nx8Ppv48fXxf9U/i5vROYw68e6A6yHTjePh1490M5jDrx7oI6VOd5jDrx7oPHw68e6A2XPx8OvHug8fDrx7oK6WLFi8xh1490H3GHXj3QHUxyvM4dePdDOPh1490EdcRWLx8OvHugy4+HXj3QGbwMOjH9IvAx6Me2O+mcgcseBh0Y9savL4dGPbG9KAx9vh0Y9sF4GHRj2x0oFY8DDox7YfAw6Me2OkiBz8DDox7YvAw6Me2OqojjeBh0Y9sX2+HRj2x0UFYnAw6Me2L7fDox7Y6RA8PJcHD6b+DH18X/TP4ub0/b4dGPbHLk5+G+/i/Lm77BnwMOjHti+3w6Me2OkIOU4GHRj2xfb4dGPbHRA5+Bh0Y9sV4GHRj2x1FgOXgYdGPbGby2HRj+kdjoHKcvh0Y9sOPL4dGPbP8Oi2DHgYdGPbB9vh0Y9sboEdBkqyDVqqFooq2tgG4mWgItSEG0KgaqUqorzcl6b7+L8ubs4cl6b7+L8ubuBhEIGLSAGq1CCHQqooqtUGiCCQNiqKgds5RrQoMNJSAUiAKWgZqasAihrO1sHm5P0338X5c3olefk/TffxflzeiQUpEFKtAygVVGbRFtUEUIwAdhAG7PzOI0NA0FtCBbWiKiDoFtUEFEtCiID6iK4cl6b7+L8ub0PPyPpvv4vy5u4HSW0AMCBusWLaoKKKEBVo0UBQrBAdKiASi2gWmW6yCIMoGQ/XIBYIdsXH+bf9kKzDorYPLyPpvv4vy5vRtw5P0338X5c3Wg1tMkDRUQGjAZQSphBmG1Vm0FUgDplBI1VYIxTpWoBajsCo5RQ2AzEsiDWxpiZKg3RsRA4cl6b7+L8ubvtw5L0338X5c3aUFYLi3WQZ/u1DtbBWI0AZCztqUGLVcTYYIzoStbGhXVjK+bbnxRGZW3OOmxUoMVcgOzXLLf8AQgcoZ/NnDd/o6ANMxqDQgK2zaK4cnfw338X5c3eVx5H0338X5c3ewDUtEBpHYoLYlOhAMjcjDUA2LSIjGhprKAH/2Q==",
    roughness: 0.2,
    metalness: 0.1,
    repeat: [8, 8],
  },
  {
    id: "carpet1",
    name: "Carpet",
    textureUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJKLYazqkcOqcjaJ6cl5505nAf1HoB0UfLQ&s",
    roughness: 0.8,
    metalness: 0.0,
    repeat: [2, 2],
  },
  {
    id: "concrete1",
    name: "Concrete",
    textureUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiau-GimslZmwam32H_NkPQSXKtEC_6Bnp5Q&s",
    roughness: 0.7,
    metalness: 0.0,
    repeat: [4, 4],
  },
  {
    id: "marble1",
    name: "Marble",
    textureUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREOdWARisI15oAyF4rmlfFw_4hXiRteiDmzQ&s",
    roughness: 0.1,
    metalness: 0.1,
    repeat: [4, 4],
  },
];

const TexturedFloor = ({ width, depth, material, position, onClick }) => {
  const texture = useTexture(material.textureUrl);
  const meshRef = useRef();

  useEffect(() => {
    if (!texture || !meshRef.current) return;

    // Configure texture properties
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(...material.repeat);
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;

    // Force texture update
    texture.needsUpdate = true;

    // Create new material with the texture
    const newMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: material.roughness,
      metalness: material.metalness,
      side: THREE.DoubleSide,
    });

    // Apply to mesh
    meshRef.current.material = newMaterial;

    return () => {
      // Clean up
      texture.dispose();
      newMaterial.dispose();
    };
  }, [texture, material]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={onClick}
    >
      <planeGeometry args={[width, depth]} />
    </mesh>
  );
};

const FurnitureItem = ({ type, position, rotation, onClick, isSelected }) => {
  let geometry,
    material,
    scale = 1;

  switch (type) {
    case "bed":
      geometry = <boxGeometry args={[1.8, 0.3, 2]} />;
      material = <meshStandardMaterial color="#5d4037" />;
      break;
    case "sofa":
      geometry = <boxGeometry args={[1.8, 0.5, 0.7]} />;
      material = <meshStandardMaterial color="#FF6347" />;
      break;
    case "table":
      geometry = <boxGeometry args={[1.2, 0.7, 0.6]} />;
      material = <meshStandardMaterial color="#8d6e63" />;
      break;
    case "chair":
      geometry = <boxGeometry args={[0.4, 0.8, 0.4]} />;
      material = <meshStandardMaterial color="#a1887f" />;
      break;
    case "cabinet":
      geometry = <boxGeometry args={[0.6, 1.2, 0.4]} />;
      material = <meshStandardMaterial color="#696969" />;
      break;
    case "tv":
      geometry = <boxGeometry args={[1.2, 0.7, 0.05]} />;
      material = <meshStandardMaterial color="#000000" />;
      break;
    default:
      geometry = <boxGeometry args={[0.5, 0.5, 0.5]} />;
      material = <meshStandardMaterial color="#78909c" />;
  }

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      castShadow
    >
      {geometry}
      {material}
      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </mesh>
  );
};

const Door = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, DOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, DOOR_HEIGHT / 2, -WALL_THICKNESS / 2 - 0.01]}>
        <boxGeometry args={[DOOR_WIDTH + 0.2, DOOR_HEIGHT + 0.2, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
};

const RoomBox = ({
  room,
  selected,
  onClick,
  onDoubleClick,
  showDoors,
  allRooms,
  selectedFurniture,
  onFurnitureClick,
  activeTool,
  selectedFurnitureType,
  onFloorClick,
  roomColors,
  floorMaterials,
  showCeilings,
}) => {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef();
  const width = room.x2 - room.x1;
  const depth = room.y2 - room.y1;
  const x = room.x1 + width / 2;
  const z = room.y1 + depth / 2;

  const roomColor = roomColors[room.name] || "#cccccc";

  const walls = [
    {
      position: [0, ROOM_HEIGHT / 2, depth / 2 - WALL_THICKNESS / 2],
      size: [width, ROOM_HEIGHT, WALL_THICKNESS],
    },
    {
      position: [0, ROOM_HEIGHT / 2, -depth / 2 + WALL_THICKNESS / 2],
      size: [width, ROOM_HEIGHT, WALL_THICKNESS],
    },
    {
      position: [width / 2 - WALL_THICKNESS / 2, ROOM_HEIGHT / 2, 0],
      size: [WALL_THICKNESS, ROOM_HEIGHT, depth],
    },
    {
      position: [-width / 2 + WALL_THICKNESS / 2, ROOM_HEIGHT / 2, 0],
      size: [WALL_THICKNESS, ROOM_HEIGHT, depth],
    },
  ];

  const doors = [];
  if (showDoors) {
    const corridor = allRooms.find((r) => r.name === "Corridor");
    if (corridor && room.name !== "Corridor") {
      const sharedWall = findSharedWall(room, corridor);

      if (sharedWall) {
        const wallCenter = (sharedWall.start + sharedWall.end) / 2;

        if (sharedWall.side === "top") {
          doors.push({
            position: [wallCenter - x, ROOM_HEIGHT / 2, depth / 2],
            rotation: [0, 0, 0],
          });
        } else if (sharedWall.side === "bottom") {
          doors.push({
            position: [wallCenter - x, ROOM_HEIGHT / 2, -depth / 2],
            rotation: [0, Math.PI, 0],
          });
        } else if (sharedWall.side === "left") {
          doors.push({
            position: [-width / 2, ROOM_HEIGHT / 2, wallCenter - z],
            rotation: [0, Math.PI / 2, 0],
          });
        } else if (sharedWall.side === "right") {
          doors.push({
            position: [width / 2, ROOM_HEIGHT / 2, wallCenter - z],
            rotation: [0, -Math.PI / 2, 0],
          });
        }
      }
    }
  }

  const floorMaterial = floorMaterials[room.name] || FLOOR_MATERIALS[0];
  //  console.log( "Floor Material:", floorMaterials[0], floorMaterials[room.name] , floorMaterial);

  //  to check
  const floor = (
    <TexturedFloor
      width={width}
      depth={depth}
      material={floorMaterial}
      // position={[0, -ROOM_HEIGHT / 2 + 0.02, 0]}
      position={[0, ROOM_HEIGHT / 8 + 0.02, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onFloorClick(e, room);
      }}
    />
  );
  const ceiling = showCeilings && (
    <mesh
      position={[0, ROOM_HEIGHT - 0.02, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry
        args={[width - WALL_THICKNESS * 2, depth - WALL_THICKNESS * 2]}
      />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.8}
        metalness={0.1}
        side={THREE.DoubleSide}
      />{" "}
    </mesh>
  );

  const renderFurniture = () => {
    if (!room.furniture || room.furniture.length === 0) return null;

    return room.furniture.map((item, i) => (
      <FurnitureItem
        key={i}
        type={item.type}
        position={[item.x - x, 1, item.y - z]}
        rotation={[0, item.rotation || 0, 0]}
        onClick={() => onFurnitureClick(item)}
        isSelected={selectedFurniture?.id === item.id}
      />
    ));
  };

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHover(false);
      }}
    >
      {walls.map((wall, index) => (
        <mesh key={index} position={wall.position}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color={
              hovered || selected ? lightenColor(roomColor, 20) : roomColor
            }
            roughness={0.4}
            metalness={0.1}
            emissive={
              hovered || selected ? lightenColor(roomColor, 10) : roomColor
            }
            emissiveIntensity={hovered || selected ? 0.2 : 0}
          />
        </mesh>
      ))}

      {doors.map((door, i) => (
        <Door key={i} position={door.position} rotation={door.rotation} />
      ))}

      {floor}
      {ceiling}
      {renderFurniture()}

      {activeTool === "place" && selected && (
        <mesh
          position={[0, -ROOM_HEIGHT / 2 + 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry
            args={[width - WALL_THICKNESS * 2, depth - WALL_THICKNESS * 2]}
          />
          <meshStandardMaterial color="#00ff00" opacity={0.2} transparent />
        </mesh>
      )}

      <Text
        position={[0, ROOM_HEIGHT + 0.5, 0]}
        fontSize={0.9}
        color="#111"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#eee"
        maxWidth={2}
        lineHeight={1}
        letterSpacing={-0.02}
      >
        {room.name}
      </Text>

      {selected && (
        <>
          <Html position={[width / 2, 0, 0]} center>
            <div className="measurement-label">{width.toFixed(2)}m</div>
          </Html>
          <Html position={[0, 0, depth / 2]} center>
            <div className="measurement-label">{depth.toFixed(2)}m</div>
          </Html>
        </>
      )}
      {ceiling}
    </group>
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

  if (Math.abs(r1.left - r2.right) < 0.1) {
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

  if (Math.abs(r1.top - r2.bottom) < 0.1) {
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
  if (color instanceof THREE.Color) {
    color = `#${color.getHexString()}`;
  }

  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);

  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);

  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

const CameraController = ({ boundaries, mode }) => {
  const { camera } = useThree();
  const width = boundaries?.width || 100;
  const height = boundaries?.height || 100;

  React.useEffect(() => {
    const maxDim = Math.max(width, height);

    if (mode === "2d") {
      camera.position.set(width / 2, maxDim * 1.5, height / 2);
      camera.rotation.set(-Math.PI / 2, 0, 0);
    } else {
      camera.position.set(width / 2, maxDim * 0.8, height / 2 + maxDim * 0.5);
      camera.lookAt(width / 2, 0, height / 2);
      camera.rotation.order = "YXZ";
    }

    camera.updateProjectionMatrix();
  }, [width, height, camera, mode]);

  return null;
};

const SunLight = ({ position }) => {
  const lightRef = useRef();

  return (
    <directionalLight
      ref={lightRef}
      position={position}
      intensity={1}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
  );
};

const Layout3D = ({ data }) => {
  const [layout, setLayout] = useState(null);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [viewMode, setViewMode] = useState("3d");
  const [gridVisible, setGridVisible] = useState(true);
  const [lightPosition, setLightPosition] = useState([20, 50, 20]);
  const [sceneReady, setSceneReady] = useState(false);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const [showCeilings, setShowCeilings] = useState(false);

  const [roomColors, setRoomColors] = useState(() => {
    const colors = {};
    data.rooms?.forEach((room) => {
      colors[room.name] = "#cccccc";
    });
    return colors;
  });
  const [showDoors, setShowDoors] = useState(true);
  const [activeTool, setActiveTool] = useState("select");
  const [selectedFurnitureType, setSelectedFurnitureType] = useState(null);
  const [projectName, setProjectName] = useState("My 3D Layout");
  const [isEditingProjectInfo, setIsEditingProjectInfo] = useState(false);
  const [floorMaterials, setFloorMaterials] = useState(() => {
    const materials = {};
    data.rooms?.forEach((room) => {
      materials[room.name] = FLOOR_MATERIALS[0];
    });
    return materials;
  });
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState(null);
  const [isFloorEditingMode, setIsFloorEditingMode] = useState(false);
  const canvasRef = useRef();
  const paneRef = useRef();
  const [walkMode, setWalkMode] = useState(false);

  const handleCanvasReady = useCallback((state) => {
    setScene(state.scene);
    setRenderer(state.gl);
    setCamera(state.camera);
  }, []);

  const handleFloorMaterialChange = useCallback((room, material) => {
    // Clear texture cache for the new material
    THREE.Cache.remove(material.textureUrl);

    setFloorMaterials((prev) => ({
      ...prev,
      [room.name]: material,
    }));
  }, []);

  const exportScene = async (format) => {
    if (!scene) {
      console.error("Three.js scene not available");
      alert("Please wait for the scene to load before exporting");
      return;
    }

    try {
      switch (format) {
        case "gltf":
        case "glb": {
          const exporter = new GLTFExporter();
          const options = {
            binary: format === "glb",
            trs: false,
            onlyVisible: true,
            embedImages: true,
          };
          const result = await exporter.parseAsync(scene, options);
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, `${projectName || "layout"}.glb`);
          } else {
            saveString(
              JSON.stringify(result),
              `${projectName || "layout"}.gltf`
            );
          }
          break;
        }
        case "obj": {
          const exporter = new OBJExporter();
          const result = exporter.parse(scene);
          saveString(result, `${projectName || "layout"}.obj`);
          break;
        }
        case "stl": {
          const exporter = new STLExporter();
          const result = exporter.parse(scene, { binary: true });
          saveArrayBuffer(result, `${projectName || "layout"}.stl`);
          break;
        }
        default:
          console.warn(`Unknown export format: ${format}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error.message}`);
    }
  };

  // Helper functions for downloading files
  const saveString = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    saveBlob(blob, filename);
  };

  const saveArrayBuffer = (buffer, filename) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveBlob(blob, filename);
  };

  const saveBlob = (blob, filename) => {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  const availableFurniture = [
    {
      id: 1,
      name: "Bed",
      type: "bed",
      width: 2,
      depth: 6,
      height: 3,
      color: "#5d4037",
    },
    {
      id: 2,
      name: "Sofa",
      type: "sofa",
      width: 1.8,
      depth: 0.7,
      height: 0.5,
      color: "#FF6347",
    },
    {
      id: 3,
      name: "Table",
      type: "table",
      width: 1.2,
      depth: 0.6,
      height: 0.7,
      color: "#8d6e63",
    },
    {
      id: 4,
      name: "Chair",
      type: "chair",
      width: 0.4,
      depth: 0.4,
      height: 0.8,
      color: "#a1887f",
    },
    {
      id: 5,
      name: "Cabinet",
      type: "cabinet",
      width: 0.6,
      depth: 0.4,
      height: 1.2,
      color: "#696969",
    },
    {
      id: 6,
      name: "TV",
      type: "tv",
      width: 1.2,
      depth: 0.05,
      height: 0.7,
      color: "#000000",
    },
  ];

  useEffect(() => {
    const pane = new Pane({
      container: document.getElementById("controls-container"),
      title: "Layout Controls",
    });

    paneRef.current = pane;

    const params = {
      mode: viewMode,
      grid: gridVisible,
      doors: showDoors,
      tool: activeTool,
    };

    pane
      .addBinding(params, "mode", {
        label: "View Mode",
        options: {
          "3D View": "3d",
          "2D Plan": "2d",
        },
      })
      .on("change", (ev) => setViewMode(ev.value));

    pane
      .addBinding(params, "grid", {
        label: "Show Grid",
      })
      .on("change", (ev) => setGridVisible(ev.value));

    pane
      .addBinding(params, "doors", {
        label: "Show Doors",
      })
      .on("change", (ev) => setShowDoors(ev.value));

    pane
      .addBinding(params, "tool", {
        label: "Tool",
        options: {
          Select: "select",
          "Place Furniture": "place",
          Delete: "delete",
        },
      })
      .on("change", (ev) => {
        setActiveTool(ev.value);
        if (ev.value !== "place") {
          setSelectedFurnitureType(null);
        }
      });

    const lightParams = {
      x: lightPosition[0],
      y: lightPosition[1],
      z: lightPosition[2],
    };

    const lightFolder = pane.addFolder({
      title: "Light Position",
      expanded: false,
    });

    lightFolder
      .addBinding(lightParams, "x", {
        label: "X",
        min: -100,
        max: 100,
        step: 1,
      })
      .on("change", (ev) => {
        setLightPosition([ev.value, lightParams.y, lightParams.z]);
      });

    lightFolder
      .addBinding(lightParams, "y", {
        label: "Y",
        min: 0,
        max: 100,
        step: 1,
      })
      .on("change", (ev) => {
        setLightPosition([lightParams.x, ev.value, lightParams.z]);
      });

    lightFolder
      .addBinding(lightParams, "z", {
        label: "Z",
        min: -100,
        max: 100,
        step: 1,
      })
      .on("change", (ev) => {
        setLightPosition([lightParams.x, lightParams.y, ev.value]);
      });

    return () => pane.dispose();
  }, [viewMode, gridVisible, showDoors, activeTool, lightPosition]);

  useEffect(() => {
    if (!paneRef.current) return;

    if (paneRef.current.roomFolder) {
      paneRef.current.remove(paneRef.current.roomFolder);
      paneRef.current.roomFolder = null;
    }

    if (!selectedRoom) return;

    const roomFolder = paneRef.current.addFolder({
      title: `Room: ${selectedRoom.name}`,
      expanded: true,
    });
    paneRef.current.roomFolder = roomFolder;

    const colorParams = {
      color: roomColors[selectedRoom.name] || "#cccccc",
    };

    roomFolder
      .addBinding(colorParams, "color", {
        label: "Color",
        view: "color",
        color: { type: "hex" },
        picker: "inline",
      })
      .on("change", (ev) => {
        setRoomColors((prev) => ({
          ...prev,
          [selectedRoom.name]: ev.value,
        }));
      });

    const roomParams = {
      name: selectedRoom.name,
      width: `${(selectedRoom.x2 - selectedRoom.x1).toFixed(2)}m`,
      depth: `${(selectedRoom.y2 - selectedRoom.y1).toFixed(2)}m`,
      area: `${(
        (selectedRoom.x2 - selectedRoom.x1) *
        (selectedRoom.y2 - selectedRoom.y1)
      ).toFixed(2)}m²`,
    };

    roomFolder.addBinding(roomParams, "name", {
      label: "Name",
      readonly: true,
    });
    roomFolder.addBinding(roomParams, "width", {
      label: "Width",
      readonly: true,
    });
    roomFolder.addBinding(roomParams, "depth", {
      label: "Depth",
      readonly: true,
    });
    roomFolder.addBinding(roomParams, "area", {
      label: "Area",
      readonly: true,
    });

    return () => {
      if (paneRef.current?.roomFolder) {
        paneRef.current.remove(paneRef.current.roomFolder);
      }
    };
  }, [selectedRoom, roomColors]);

  useEffect(() => {
    // console.log("api hit")
    axios
      .post(API_URL, data, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        setLayout(response.data.layout);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch layout: " + err.message);
        console.error(err);
      });
  }, [data]);

  const handleRoomClick = useCallback((room) => {
    setSelectedRoom(room);
    setSelectedFurniture(null);
  }, []);

  const deleteSelectedFurniture = useCallback(() => {
    if (!selectedFurniture || !selectedRoom) return;

    setLayout((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) => ({
        ...room,
        furniture:
          room.furniture?.filter((item) => item.id !== selectedFurniture.id) ||
          [],
      })),
    }));
    setSelectedFurniture(null);
  }, [selectedFurniture, selectedRoom]);

  const moveFurniture = useCallback(
    (direction) => {
      if (!selectedFurniture || !selectedRoom) return;

      const moveAmount = 0.1;

      setLayout((prev) => ({
        ...prev,
        rooms: prev.rooms.map((room) => {
          if (room.name !== selectedRoom.name) return room;

          return {
            ...room,
            furniture:
              room.furniture?.map((item) => {
                if (item.id !== selectedFurniture.id) return item;

                let newX = item.x;
                let newY = item.y;

                if (direction === "left") newX -= moveAmount;
                if (direction === "right") newX += moveAmount;
                if (direction === "forward") newY -= moveAmount;
                if (direction === "backward") newY += moveAmount;

                return { ...item, x: newX, y: newY };
              }) || [],
          };
        }),
      }));
    },
    [selectedFurniture, selectedRoom]
  );

  const unselectFurniture = useCallback(() => {
    setSelectedFurniture(null);
  }, []);

  const handleRoomDoubleClick = useCallback((room) => {
    if (canvasRef.current) {
      const camera = canvasRef.current.getThreeCamera();
      const controls = canvasRef.current.getThreeControls();

      const width = room.x2 - room.x1;
      const depth = room.y2 - room.y1;
      const x = room.x1 + width / 2;
      const z = room.y1 + depth / 2;

      const target = new THREE.Vector3(x, 0, z);
      const distance = Math.max(width, depth) * 1.5;

      const newPosition = new THREE.Vector3(
        x,
        distance * 0.7,
        z + distance * 0.5
      );

      controls.target.lerp(target, 0.1);
      camera.position.lerp(newPosition, 0.1);
    }
  }, []);

  const handleFurnitureClick = useCallback(
    (furniture) => {
      if (activeTool === "select") {
        setSelectedFurniture(furniture);
      } else if (activeTool === "delete") {
        setLayout((prev) => ({
          ...prev,
          rooms: prev.rooms.map((room) => ({
            ...room,
            furniture:
              room.furniture?.filter((item) => item.id !== furniture.id) || [],
          })),
        }));
        setSelectedFurniture(null);
      }
    },
    [activeTool]
  );

  const handleFloorClick = useCallback(
    (e, room) => {
      e.stopPropagation();

      if (isFloorEditingMode && selectedFloorMaterial) {
        handleFloorMaterialChange(room, selectedFloorMaterial);
      } else if (activeTool === "place" && selectedFurnitureType) {
        const point = e.point;
        addFurnitureToRoom(selectedFurnitureType, [point.x, point.z], room);
        setSelectedRoom(room);
      }
    },
    [
      isFloorEditingMode,
      selectedFloorMaterial,
      activeTool,
      selectedFurnitureType,
      handleFloorMaterialChange,
    ]
  );

  const addFurnitureToRoom = useCallback(
    (furnitureType, position = null, room = null) => {
      const targetRoom = room || selectedRoom;
      if (!targetRoom) return;

      const furnitureTemplate = availableFurniture.find(
        (item) => item.type === furnitureType
      );
      if (!furnitureTemplate) return;

      const defaultX = targetRoom.x1 + (targetRoom.x2 - targetRoom.x1) / 2;
      const defaultY = targetRoom.y1 + (targetRoom.y2 - targetRoom.y1) / 2;

      const newFurniture = {
        ...furnitureTemplate,
        id: Date.now(),
        x: position ? position[0] : defaultX,
        y: position ? position[1] : defaultY,
        rotation: 0,
      };

      setLayout((prev) => ({
        ...prev,
        rooms: prev.rooms.map((r) =>
          r.name === targetRoom.name
            ? {
                ...r,
                furniture: [...(r.furniture || []), newFurniture],
              }
            : r
        ),
      }));

      setSelectedFurniture(newFurniture);
    },
    [selectedRoom]
  );

  const captureScreenshot = useCallback(() => {
    const canvasEl = document.querySelector("canvas");
    if (!canvasEl) return;

    html2canvas(document.querySelector(".canvas-container"), {
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
  }, [projectName]);

  const saveProject = useCallback(async () => {
    if (!projectName.trim() || !layout) return;
    try {
      const payload = {
        name: projectName,
        description: "3D Layout Project",
        layout: layout,
      };

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

      // console.log("Layout saved:", response.data);
      alert("Layout saved successfully!");
      setIsEditingProjectInfo(false);
    } catch (err) {
      console.error("Failed to save layout:", err);
      alert("Error saving layout. Please try again.");
    }
  }, [projectName, layout]);

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!layout) {
    return <div className="text-center mt-4">Loading layout...</div>;
  }

  const rooms = layout?.rooms || [];
  const width = layout?.boundaries?.width || 100;
  const height = layout?.boundaries?.height || 100;
  const centerX = width / 2;
  const centerZ = height / 2;

  return (
    <ErrorBoundary>
      <div
        style={{ width: "100%", height: "80vh", position: "relative" }}
        className="canvas-container"
      >
        <div
          id="controls-container"
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            color: "#ffffff",
            borderRadius: "5px",
            maxWidth: "300px",
          }}
        />

        <div
          style={{
            position: "absolute",
            // top: 10,
            left: 10,
            zIndex: 100,
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-blue-900 text-white rounded hover:bg-blue-600 transition"
          >
            {viewMode === "3d" ? "Switch to 2D" : "Switch to 3D"}
          </button>
          <button
            onClick={captureScreenshot}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-green-900 text-white rounded hover:bg-green-600 transition"
          >
            Export Screenshot
          </button>
          {/* <button
            onClick={() => setIsEditingProjectInfo(true)}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-purple-900 text-white rounded hover:bg-purple-600 transition"
          >
            Project Info
          </button> */}
          <button
            onClick={() => setShowCeilings(!showCeilings)}
            className={`px-3 py-1 cursor-pointer rounded hover:opacity-100 transition-all duration-200 text-white font-medium text-sm ${
              showCeilings ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            {showCeilings ? "Hide Ceilings" : "Show Ceilings"}
          </button>
          <button
            onClick={() => exportScene("glb")}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-orange-900 text-white rounded hover:bg-orange-600 transition"
            title="Export as GLB (binary format)"
          >
            Export GLB
          </button>

          <button
            onClick={() => exportScene("gltf")}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-orange-800 text-white rounded hover:bg-orange-500 transition"
            title="Export as GLTF (JSON format)"
          >
            Export GLTF
          </button>

          <button
            onClick={() => exportScene("obj")}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-orange-700 text-white rounded hover:bg-orange-400 transition"
            title="Export as OBJ (Wavefront format)"
          >
            Export OBJ
          </button>

          <button
            onClick={() => exportScene("stl")}
            style={{ padding: "5px 10px", cursor: "pointer" }}
            className="bg-orange-600 text-white rounded hover:bg-orange-300 transition"
            title="Export as STL (3D printing format)"
          >
            Export STL
          </button>
          <button
  onClick={() => {
    setWalkMode(!walkMode);
    // Reset camera when exiting walk mode
    if (walkMode && canvasRef.current) {
      const controls = canvasRef.current.getThreeControls();
      controls.reset();
    }
  }}
  style={{ padding: "5px 10px", cursor: "pointer" }}
  className={`${
    walkMode ? "bg-red-500" : "bg-blue-500"
  } text-white rounded hover:opacity-90 transition`}
>
  {walkMode ? "Exit Walk Mode" : "Enter Walk Mode"}
</button>
        </div>

        <div className="fixed bottom-32 left-2 z-[100] bg-white/80 p-2 rounded-lg flex gap-2 flex-wrap shadow-md">
          <button
            onClick={() => {
              setIsFloorEditingMode(!isFloorEditingMode);
              if (isFloorEditingMode) {
                setSelectedFloorMaterial(null);
              }
            }}
            className={`px-3 py-1 cursor-pointer rounded hover:opacity-100 transition-all duration-200 text-white font-medium text-sm ${
              isFloorEditingMode ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {isFloorEditingMode ? "Exit Floor Edit" : "Edit Floors"}
          </button>

          {isFloorEditingMode && (
            <>
              <h3 className="font-bold text-gray-800 w-full">
                Floor Materials:
              </h3>
              {FLOOR_MATERIALS.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedFloorMaterial(material)}
                  className={`px-2 py-1 cursor-pointer rounded hover:opacity-100 transition-all duration-200 text-white font-medium text-sm ${
                    selectedFloorMaterial?.id === material.id
                      ? "ring-2 ring-black"
                      : "opacity-70"
                  }`}
                  style={{ backgroundColor: "#5d4037" }} // Brown color for floor buttons
                  title={material.name}
                >
                  {material.name}
                </button>
              ))}
            </>
          )}
        </div>
        {/* Furniture toolbar */}
        <div className="fixed bottom-2 left-2 z-[100] bg-white/80 p-2 rounded-lg flex gap-2 flex-wrap shadow-md">
          <h3 className="font-bold text-gray-800">Furniture:</h3>
          {availableFurniture.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTool("place");
                setSelectedFurnitureType(item.type);
              }}
              className={`px-2 py-1 cursor-pointer rounded hover:opacity-100 transition-all duration-200 text-white font-medium text-sm
        ${
          selectedFurnitureType === item.type
            ? "ring-2 ring-black"
            : "opacity-70"
        }
        ${selectedFurniture?.type === item.type ? "opacity-100" : ""}`}
              style={{ backgroundColor: item.color }}
              title={item.name}
            >
              {item.name}
            </button>
          ))}

          {/* Furniture controls toolbar */}
          {selectedFurniture && (
            <div className="fixed bottom-16 left-2 z-[100] bg-white/80 p-2 rounded-lg flex gap-2 shadow-md">
              <button
                onClick={unselectFurniture}
                className="px-3 py-1 cursor-pointer bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
              >
                Unselect
              </button>
              <button
                onClick={deleteSelectedFurniture}
                className="px-3 py-1 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                Delete
              </button>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveFurniture("forward")}
                  className="px-2 py-0.5 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                >
                  ↑
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFurniture("left")}
                    className="px-2 py-0.5 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => moveFurniture("backward")}
                    className="px-2 py-0.5 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => moveFurniture("right")}
                    className="px-2 py-0.5 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Room info panel */}
        {selectedRoom && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 100,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "300px",
            }}
          >
            <h3 className="font-bold">{selectedRoom.name}</h3>
            <p>
              Dimensions: {(selectedRoom.x2 - selectedRoom.x1).toFixed(2)}m x{" "}
              {(selectedRoom.y2 - selectedRoom.y1).toFixed(2)}m
            </p>
            <p>
              Area:{" "}
              {(
                (selectedRoom.x2 - selectedRoom.x1) *
                (selectedRoom.y2 - selectedRoom.y1)
              ).toFixed(2)}
              m²
            </p>
            <p>Floor: {floorMaterials[selectedRoom.name]?.name || "Default"}</p>
            {selectedRoom.furniture && selectedRoom.furniture.length > 0 && (
              <div>
                <p className="font-bold mt-2">Furniture:</p>
                <ul>
                  {selectedRoom.furniture.map((item, i) => (
                    <li
                      key={i}
                      className={
                        selectedFurniture?.id === item.id ? "font-bold" : ""
                      }
                    >
                      {item.type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Project info modal */}
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

        <Canvas
          shadows
          ref={canvasRef}
          onCreated={handleCanvasReady}
          camera={{ position: [centerX, 50, centerZ + 50], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          {walkMode ? (
  <FirstPersonControls 
    active={walkMode} 
    boundaries={layout?.boundaries} 
    rooms={layout?.rooms}
  />
) : (
  <OrbitControls
    enablePan={true}
    enableZoom={true}
    enableRotate={viewMode === "3d"}
    target={[centerX, 0, centerZ]}
  />
)}
          <CameraController boundaries={layout?.boundaries} mode={viewMode} />

          <ambientLight intensity={0.5} />
          <SunLight position={lightPosition} />

          {/* <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={viewMode === "3d"}
            target={[centerX, 0, centerZ]}
          /> */}

          {/* Ground */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[centerX, -0.1, centerZ]}
            receiveShadow
          >
            <planeGeometry args={[width * 1.5, height * 1.5]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>

          {/* Grid helper */}
          {gridVisible && (
            <gridHelper
              args={[Math.max(width, height) * 1.2, 20, "#999", "#999"]}
              position={[centerX, 0.01, centerZ]}
            />
          )}

          {/* Rooms */}
          {rooms.map((room, index) => (
            <RoomBox
              key={index}
              room={room}
              selected={selectedRoom === room}
              onClick={() => handleRoomClick(room)}
              onDoubleClick={() => handleRoomDoubleClick(room)}
              showDoors={showDoors}
              allRooms={rooms}
              selectedFurniture={selectedFurniture}
              onFurnitureClick={handleFurnitureClick}
              activeTool={activeTool}
              selectedFurnitureType={selectedFurnitureType}
              onFloorClick={handleFloorClick}
              roomColors={roomColors}
              floorMaterials={floorMaterials}
              showCeilings={showCeilings}
            />
          ))}
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default Layout3D;

