import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FirstPersonControls = ({ active, boundaries, rooms }) => {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const prevTime = useRef(0);

  // Set initial camera position
  useEffect(() => {
    if (!active || !boundaries) return;
    
    const centerX = boundaries.width / 2;
    const centerZ = boundaries.height / 2;
    camera.position.set(centerX, 1.6, centerZ + 5); // 1.6m is roughly eye level
    camera.rotation.set(0, 0, 0);
  }, [active, boundaries, camera]);

  // Handle keyboard input
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = true;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.current = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.current = true;
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = false;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.current = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.current = false;
          break;
      }
    };

    const onMouseMove = (event) => {
      if (!document.pointerLockElement) return;
      
      camera.rotation.y -= event.movementX * 0.002;
      camera.rotation.x -= event.movementY * 0.002;
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
    };

    const onClick = () => {
      if (active && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick);
      document.exitPointerLock();
    };
  }, [active, camera]);

  // Movement logic
  useFrame((state, delta) => {
    if (!active) return;

    const time = performance.now();
    const deltaTime = Math.min(0.1, (time - prevTime.current) / 1000);
    prevTime.current = time;

    velocity.current.x -= velocity.current.x * 10.0 * deltaTime;
    velocity.current.z -= velocity.current.z * 10.0 * deltaTime;

    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * 5.0 * deltaTime;
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * 5.0 * deltaTime;
    }

    // Apply movement
    camera.translateX(velocity.current.x * deltaTime);
    camera.translateZ(velocity.current.z * deltaTime);

    // Boundary checks
    if (boundaries) {
      const halfWidth = boundaries.width / 2;
      const halfHeight = boundaries.height / 2;
      const centerX = boundaries.width / 2;
      const centerZ = boundaries.height / 2;

      camera.position.x = THREE.MathUtils.clamp(
        camera.position.x,
        centerX - halfWidth + 0.5,
        centerX + halfWidth - 0.5
      );
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        centerZ - halfHeight + 0.5,
        centerZ + halfHeight - 0.5
      );
    }

    // Collision detection with walls
    if (rooms) {
      const playerPos = new THREE.Vector3(
        camera.position.x,
        0,
        camera.position.z
      );
      const playerRadius = 0.5;

      for (const room of rooms) {
        const roomWidth = room.x2 - room.x1;
        const roomDepth = room.y2 - room.y1;
        const roomCenterX = room.x1 + roomWidth / 2;
        const roomCenterZ = room.y1 + roomDepth / 2;

        // Check if player is inside this room
        if (
          playerPos.x >= room.x1 &&
          playerPos.x <= room.x2 &&
          playerPos.z >= room.y1 &&
          playerPos.z <= room.y2
        ) {
          // Check collision with walls
          const distToLeft = playerPos.x - room.x1;
          const distToRight = room.x2 - playerPos.x;
          const distToTop = playerPos.z - room.y1;
          const distToBottom = room.y2 - playerPos.z;

          if (distToLeft < playerRadius) {
            camera.position.x = room.x1 + playerRadius;
          }
          if (distToRight < playerRadius) {
            camera.position.x = room.x2 - playerRadius;
          }
          if (distToTop < playerRadius) {
            camera.position.z = room.y1 + playerRadius;
          }
          if (distToBottom < playerRadius) {
            camera.position.z = room.y2 - playerRadius;
          }
          break;
        }
      }
    }
  });

  return null;
};

export default FirstPersonControls;