import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useFirstPersonControls = ({ active, boundaries, rooms, onRoomEnter }) => {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const canJump = useRef(true);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const prevTime = useRef(0);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [interactionPrompt, setInteractionPrompt] = useState(null);
  const interactableObjects = useRef([]);

  // Set initial camera position
  useEffect(() => {
    if (!active || !boundaries) return;
    
    const centerX = boundaries.width / 2;
    const centerZ = boundaries.height / 2;
    camera.position.set(centerX, 1.6, centerZ + 5);
    camera.rotation.set(0, 0, 0);
  }, [active, boundaries, camera]);

  // Register interactable objects
  const registerInteractable = (object, callback, prompt) => {
    interactableObjects.current.push({ object, callback, prompt });
    return () => {
      interactableObjects.current = interactableObjects.current.filter(
        item => item.object !== object
      );
    };
  };

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
        case "ShiftLeft":
        case "ShiftRight":
          setIsRunning(true);
          break;
        case "Space":
          if (canJump.current) {
            velocity.current.y += 4;
            canJump.current = false;
          }
          break;
        case "KeyE":
          checkForInteractions();
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
        case "ShiftLeft":
        case "ShiftRight":
          setIsRunning(false);
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

  const checkForInteractions = () => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    const intersects = raycaster.intersectObjects(
      interactableObjects.current.map(obj => obj.object),
      true
    );

    if (intersects.length > 0) {
      const closest = intersects[0];
      const interactable = interactableObjects.current.find(
        obj => obj.object === closest.object || closest.object.parent === obj.object
      );
      
      if (interactable?.callback) {
        interactable.callback();
      }
    }
  };

  useFrame((state, delta) => {
    if (!active) return;

    const time = performance.now();
    const deltaTime = Math.min(0.1, (time - prevTime.current) / 1000);
    prevTime.current = time;

    velocity.current.y -= 9.8 * deltaTime;
    velocity.current.x -= velocity.current.x * 10.0 * deltaTime;
    velocity.current.z -= velocity.current.z * 10.0 * deltaTime;

    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    const speed = isRunning ? 10.0 : 5.0;

    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * speed * deltaTime;
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * speed * deltaTime;
    }

    camera.translateX(velocity.current.x * deltaTime);
    camera.translateZ(velocity.current.z * deltaTime);
    camera.position.y += velocity.current.y * deltaTime;

    if (camera.position.y <= 1.6) {
      camera.position.y = 1.6;
      velocity.current.y = 0;
      canJump.current = true;
    }

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

    if (rooms) {
      const playerPos = new THREE.Vector3(
        camera.position.x,
        0,
        camera.position.z
      );
      const playerRadius = 0.5;

      let newCurrentRoom = null;
      
      for (const room of rooms) {
        if (
          playerPos.x >= room.x1 &&
          playerPos.x <= room.x2 &&
          playerPos.z >= room.y1 &&
          playerPos.z <= room.y2
        ) {
          newCurrentRoom = room;
          
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

      if (newCurrentRoom !== currentRoom) {
        setCurrentRoom(newCurrentRoom);
        if (onRoomEnter && newCurrentRoom) {
          onRoomEnter(newCurrentRoom);
        }
      }
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    raycaster.far = 3;
    
    const intersects = raycaster.intersectObjects(
      interactableObjects.current.map(obj => obj.object),
      true
    );

    if (intersects.length > 0) {
      const closest = intersects[0];
      const interactable = interactableObjects.current.find(
        obj => obj.object === closest.object || closest.object.parent === obj.object
      );
      
      setInteractionPrompt(interactable?.prompt || null);
    } else {
      setInteractionPrompt(null);
    }
  });

  return {
    registerInteractable,
    currentRoom,
    interactionPrompt
  };
};

const FirstPersonControls = (props) => {
  useFirstPersonControls(props);
  return null;
};

export default FirstPersonControls;