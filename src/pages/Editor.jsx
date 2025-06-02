import React, { useState, useRef, useEffect, useCallback } from 'react';
import {Pencil , Minus , ImageDown} from 'lucide-react';
import { toPng } from "html-to-image";
import {toast} from "react-toastify";

const CampusEditor = () => {
  const ref = useRef();

  // Editor state
  const [tool, setTool] = useState('select');
  const [color, setColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('transparent');
  const [brushSize, setBrushSize] = useState(3);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Furniture items
  const furnitureItems = [
    { type: 'chair', label: 'Chair', width: 30, height: 30 },
    { type: 'sofa', label: 'Sofa', width: 80, height: 30 },
    { type: 'table', label: 'Table', width: 60, height: 60 },
    { type: 'bed', label: 'Bed', width: 80, height: 50 },
    { type: 'door', label: 'Door', width: 20, height: 40 },
    { type: 'window', label: 'Window', width: 40, height: 10 },
  ];

  // Save to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(elements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = JSON.parse(history[historyIndex - 1]);
      setElements(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const saveThePng = () =>{
     if (canvasContainerRef.current === null) return;

    toPng(canvasContainerRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "exported-image.png";
        link.href = dataUrl;
        link.click();
        toast.success("Image exported successfully!");
        // alert("Image exported successfully!");
      })
      .catch((err) => {
        toast.error("Failed to export image!!");
        // console.error("Failed to export image", err);
      });

  }

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = JSON.parse(history[historyIndex + 1]);
      setElements(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Handle mouse down
  // const handleMouseDown = (e) => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const x = (e.clientX - rect.left - offset.x) / scale;
  //   const y = (e.clientY - rect.top - offset.y) / scale;
    
  //   setStartPos({ x, y });

  //   if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
  //     // Middle mouse button or Ctrl+Left click for panning
  //     setIsDragging(true);
  //     setDragStart({ x: e.clientX, y: e.clientY });
  //     return;
  //   }

  //   if (tool === 'pencil') {
  //     setIsDrawing(true);
  //     const newElement = {
  //       type: 'path',
  //       points: [{ x, y }],
  //       color,
  //       size: brushSize,
  //       id: Date.now(),
  //     };
  //     setElements([...elements, newElement]);
  //   } else if (tool === 'eraser') {
  //     setIsDrawing(true);
  //     const newElement = {
  //       type: 'path',
  //       points: [{ x, y }],
  //       color: '#ffffff', // Eraser draws with white
  //       size: brushSize * 2, // Make eraser slightly larger
  //       id: Date.now(),
  //     };
  //     setElements([...elements, newElement]);
  //   } else if (tool === 'text') {
  //     setTextPosition({ x, y });
  //     setShowTextInput(true);
  //   } else if (tool === 'select') {
  //     // Check if clicking on an element
  //     const clickedElement = [...elements].reverse().find(el => {
  //       if (el.type === 'path') {
  //         // Simple hit test for paths
  //         return el.points.some(point => 
  //           Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10
  //         );
  //       } else if (el.type === 'text') {
  //         // Approximate text hit test
  //         return (
  //           x >= el.x - 10 && x <= el.x + (el.content.length * 10) &&
  //           y >= el.y - 16 && y <= el.y + 5
  //         );
  //       } else {
  //         return (
  //           x >= el.x && x <= el.x + el.width &&
  //           y >= el.y && y <= el.y + el.height
  //         );
  //       }
  //     });
      
  //     if (clickedElement) {
  //       setSelectedElement(clickedElement.id);
        
  //       // If the element is furniture, prepare to move it
  //       if (clickedElement.type === 'furniture') {
  //         setIsDragging(true);
  //         setDragStart({ x, y });
  //       }
  //     } else {
  //       setSelectedElement(null);
  //     }
  //   } else {
  //     setIsDrawing(true);
  //   }
  // };

  // // Handle mouse move
  // const handleMouseMove = (e) => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const x = (e.clientX - rect.left - offset.x) / scale;
  //   const y = (e.clientY - rect.top - offset.y) / scale;

  //   if (isDragging && tool === 'select' && selectedElement) {
  //     // Move selected element
  //     const deltaX = x - dragStart.x;
  //     const deltaY = y - dragStart.y;
      
  //     setElements(prev => prev.map(el => {
  //       if (el.id === selectedElement) {
  //         return {
  //           ...el,
  //           x: el.x + deltaX,
  //           y: el.y + deltaY
  //         };
  //       }
  //       return el;
  //     }));
      
  //     setDragStart({ x, y });
  //     return;
  //   } else if (isDragging) {
  //     // Pan the canvas
  //     const deltaX = e.clientX - dragStart.x;
  //     const deltaY = e.clientY - dragStart.y;
  //     setOffset(prev => ({
  //       x: prev.x + deltaX,
  //       y: prev.y + deltaY
  //     }));
  //     setDragStart({ x: e.clientX, y: e.clientY });
  //     return;
  //   }

  //   if (!isDrawing) return;

  //   if (tool === 'pencil' || tool === 'eraser') {
  //     setElements(prev => {
  //       const newElements = [...prev];
  //       const lastElement = newElements[newElements.length - 1];
  //       lastElement.points = [...lastElement.points, { x, y }];
  //       return newElements;
  //     });
  //   } else if (['rectangle', 'circle', 'triangle', 'pentagon', 'line', 'arrow'].includes(tool)) {
  //     setElements(prev => {
  //       // Remove the last element if we're still drawing
  //       const elementsWithoutLast = prev.slice(0, -1);
        
  //       const width = x - startPos.x;
  //       const height = y - startPos.y;
        
  //       const newElement = {
  //         type: tool,
  //         x: startPos.x,
  //         y: startPos.y,
  //         width,
  //         height,
  //         color,
  //         fill: fillColor,
  //         id: Date.now(),
  //       };
        
  //       return [...elementsWithoutLast, newElement];
  //     });
  //   }
  // };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    
    setStartPos({ x, y });

    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      const newElement = {
        type: 'path',
        points: [{ x, y }],
        color: tool === 'eraser' ? '#ffffff' : color,
        size: tool === 'eraser' ? brushSize * 2 : brushSize,
        id: Date.now(),
      };
      setElements([...elements, newElement]);
    } 
    else if (tool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
    } 
    else if (tool === 'select') {
      // Check if clicking on an element
      const clickedElement = [...elements].reverse().find(el => {
        if (el.type === 'path') {
          return el.points.some(point => 
            Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10
          );
        } else if (el.type === 'text') {
          return (
            x >= el.x - 10 && x <= el.x + (el.content.length * 10) &&
            y >= el.y - 16 && y <= el.y + 5
          );
        } else {
          return (
            x >= el.x && x <= el.x + Math.abs(el.width) &&
            y >= el.y && y <= el.y + Math.abs(el.height)
          );
        }
      });
      
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        setIsDragging(true);
        setDragStart({ x, y });
      } else {
        setSelectedElement(null);
      }
    } 
    else {
      // For shapes (rectangle, circle, etc.)
      setIsDrawing(true);
      const newElement = {
        type: tool,
        x,
        y,
        width: 0,
        height: 0,
        color,
        fill: fillColor,
        id: Date.now(),
      };
      setElements([...elements, newElement]);
    }
  };

  // Modified handleMouseMove function
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    if (isDragging && selectedElement) {
      // Move selected element
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement) {
          return {
            ...el,
            x: el.x + deltaX,
            y: el.y + deltaY
          };
        }
        return el;
      }));
      
      setDragStart({ x, y });
      return;
    } 
    else if (isDragging) {
      // Pan the canvas
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing) return;

    if (tool === 'pencil' || tool === 'eraser') {
      setElements(prev => {
        const newElements = [...prev];
        const lastElement = newElements[newElements.length - 1];
        lastElement.points = [...lastElement.points, { x, y }];
        return newElements;
      });
    } 
    else if (['rectangle', 'circle', 'triangle', 'pentagon', 'line', 'arrow'].includes(tool)) {
      setElements(prev => {
        const newElements = [...prev];
        const lastElement = newElements[newElements.length - 1];
        
        // Update the last element's dimensions
        return newElements.map((el, index) => {
          if (index === newElements.length - 1) {
            return {
              ...el,
              width: x - el.x,
              height: y - el.y
            };
          }
          return el;
        });
      });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging || isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
    setIsDragging(false);
  };

  // Handle wheel for zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomIntensity = 0.1;
    const newScale = scale * (1 + delta * zoomIntensity / 100);
    setScale(Math.max(0.1, Math.min(5, newScale)));
  };

  // Add text to canvas
  const handleAddText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const newElement = {
      type: 'text',
      x: textPosition.x,
      y: textPosition.y,
      content: textInput,
      color,
      id: Date.now(),
    };

    setElements([...elements, newElement]);
    setTextInput('');
    setShowTextInput(false);
    saveToHistory();
  };

  // Add furniture to canvas
  const addFurniture = (furnitureType) => {
    const furniture = furnitureItems.find(item => item.type === furnitureType);
    if (!furniture) return;

    const newElement = {
      type: 'furniture',
      furnitureType,
      x: 50,
      y: 50,
      width: furniture.width,
      height: furniture.height,
      color: '#654321',
      fill: '#8b4513',
      id: Date.now(),
    };

    setElements([...elements, newElement]);
    saveToHistory();
  };

  // Delete selected element
  const deleteSelected = () => {
    if (selectedElement === null) return;
    setElements(elements.filter(el => el.id !== selectedElement));
    setSelectedElement(null);
    saveToHistory();
  };

  // Fill color
  const handleFillColor = () => {
    if (selectedElement === null) return;
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, fill: fillColor } : el
    ));
    saveToHistory();
  };

  // Render elements on canvas
  const renderElement = (element) => {
    const isSelected = selectedElement === element.id;
    const selectionStyle = isSelected ? 'outline-dashed outline-1 outline-blue-500' : '';

    switch (element.type) {
      case 'path':
        return (
          <path
            key={element.id}
            d={`M ${element.points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
            stroke={element.color}
            strokeWidth={element.size}
            fill="none"
            className={selectionStyle}
          />
        );
      case 'rectangle':
        return (
          <rect
            key={element.id}
            x={element.width < 0 ? element.x + element.width : element.x}
            y={element.height < 0 ? element.y + element.height : element.y}
            width={Math.abs(element.width)}
            height={Math.abs(element.height)}
            stroke={element.color}
            strokeWidth={2}
            fill={element.fill || 'none'}
            className={selectionStyle}
          />
        );
      case 'circle':
        const radius = Math.sqrt(Math.pow(element.width, 2) + Math.pow(element.height, 2));
        return (
          <circle
            key={element.id}
            cx={element.x}
            cy={element.y}
            r={radius}
            stroke={element.color}
            strokeWidth={2}
            fill={element.fill || 'none'}
            className={selectionStyle}
          />
        );
      case 'triangle':
        return (
          <polygon
            key={element.id}
            points={`${element.x},${element.y + element.height} ${element.x + element.width},${element.y + element.height} ${element.x + element.width/2},${element.y}`}
            stroke={element.color}
            strokeWidth={2}
            fill={element.fill || 'none'}
            className={selectionStyle}
          />
        );
      case 'pentagon':
        const points = [
          { x: element.x + element.width/2, y: element.y },
          { x: element.x + element.width, y: element.y + element.height/3 },
          { x: element.x + element.width*0.8, y: element.y + element.height },
          { x: element.x + element.width*0.2, y: element.y + element.height },
          { x: element.x, y: element.y + element.height/3 },
        ];
        return (
          <polygon
            key={element.id}
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            stroke={element.color}
            strokeWidth={2}
            fill={element.fill || 'none'}
            className={selectionStyle}
          />
        );
      case 'line':
        return (
          <line
            key={element.id}
            x1={element.x}
            y1={element.y}
            x2={element.x + element.width}
            y2={element.y + element.height}
            stroke={element.color}
            strokeWidth={2}
            className={selectionStyle}
          />
        );
      case 'arrow':
        const angle = Math.atan2(element.height, element.width);
        const arrowSize = 10;
        const arrowPoints = [
          { x: element.x + element.width, y: element.y + element.height },
          { 
            x: element.x + element.width - arrowSize * Math.cos(angle - Math.PI/6),
            y: element.y + element.height - arrowSize * Math.sin(angle - Math.PI/6)
          },
          { 
            x: element.x + element.width - arrowSize * Math.cos(angle + Math.PI/6),
            y: element.y + element.height - arrowSize * Math.sin(angle + Math.PI/6)
          },
        ];
        return (
          <g key={element.id} className={selectionStyle}>
            <line
              x1={element.x}
              y1={element.y}
              x2={element.x + element.width}
              y2={element.y + element.height}
              stroke={element.color}
              strokeWidth={2}
            />
            <polygon
              points={arrowPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill={element.color}
            />
          </g>
        );
      case 'text':
        return (
          <text
            key={element.id}
            x={element.x}
            y={element.y}
            fill={element.color}
            fontSize="16"
            className={`select-none ${selectionStyle}`}
          >
            {element.content}
          </text>
        );
      case 'furniture':
        return (
          <g 
            key={element.id} 
            transform={`translate(${element.x}, ${element.y})`}
            className={selectionStyle}
          >
            <rect
              width={element.width}
              height={element.height}
              fill={element.fill || element.color}
              stroke="#000"
              strokeWidth="1"
            />
            {/* Furniture-specific rendering */}
            {element.furnitureType === 'chair' && (
              <>
                <rect x="5" y="5" width="20" height="20" fill="#f0e68c" />
                <rect x="10" y="25" width="10" height="5" fill="#8b4513" />
              </>
            )}
            {element.furnitureType === 'sofa' && (
              <>
                <rect x="5" y="5" width="70" height="20" fill="#8b4513" rx="5" />
                <rect x="10" y="25" width="60" height="5" fill="#654321" />
              </>
            )}
            {element.furnitureType === 'table' && (
              <>
                <rect x="5" y="5" width="50" height="50" fill="#8b4513" />
                <rect x="15" y="15" width="30" height="30" fill="#f0e68c" />
              </>
            )}
            {element.furnitureType === 'bed' && (
              <>
                <rect x="5" y="5" width="70" height="40" fill="#9370db" rx="5" />
                <rect x="10" y="10" width="20" height="30" fill="#663399" />
              </>
            )}
            {element.furnitureType === 'door' && (
              <>
                <rect x="0" y="0" width="20" height="40" fill="#8b4513" />
                <circle cx="15" cy="35" r="2" fill="#000" />
              </>
            )}
            {element.furnitureType === 'window' && (
              <>
                <rect x="0" y="0" width="40" height="10" fill="#add8e6" />
                <line x1="20" y1="0" x2="20" y2="10" stroke="#000" strokeWidth="1" />
                <line x1="0" y1="5" x2="40" y2="5" stroke="#000" strokeWidth="1" />
              </>
            )}
          </g>
        );
      default:
        return null;
    }
  };

  // Render grid
  const renderGrid = () => {
    const gridSize = 20 * scale;
    const width = canvasContainerRef.current?.clientWidth || 800;
    const height = canvasContainerRef.current?.clientHeight || 600;
    
    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth={1 / scale}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth={1 / scale}
        />
      );
    }
    
    return lines;
  };

  // Reset view
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const resetCanvas = () =>{
    setElements([]);
    setSelectedElement(null);
    setHistory([]);
    setHistoryIndex(-1);
    saveToHistory();
  }

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, [history.length, saveToHistory]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-2 flex flex-wrap gap-2">
        {/* Tools */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setTool('select')}
            className={`p-2 rounded ${tool === 'select' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Select"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Pencil"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg> */}
            <Pencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Eraser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded ${tool === 'text' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"/>
            </svg>
          </button>
        </div>
        
        {/* Shapes */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded ${tool === 'rectangle' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Rectangle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Circle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('triangle')}
            className={`p-2 rounded ${tool === 'triangle' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Triangle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('pentagon')}
            className={`p-2 rounded ${tool === 'pentagon' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Pentagon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.685 1.545a.5.5 0 0 1 .63 0l6.263 5.088a.5.5 0 0 1 .161.539l-2.362 7.479a.5.5 0 0 1-.476.349H4.099a.5.5 0 0 1-.476-.35L1.26 7.173a.5.5 0 0 1 .161-.54l6.263-5.087Zm8.213 5.28a.5.5 0 0 0-.162-.54L8.316.257a.5.5 0 0 0-.631 0L.264 6.286a.5.5 0 0 0-.162.538l2.788 8.827a.5.5 0 0 0 .476.349h9.268a.5.5 0 0 0 .476-.35l2.788-8.826Z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setTool('line')}
            className={`p-2 rounded ${tool === 'line' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Line"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V15h12.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5z"/>
            </svg> */}
            <Minus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setTool('arrow')}
            className={`p-2 rounded ${tool === 'arrow' ? 'bg-blue-500' : 'bg-gray-700'}`}
            title="Arrow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </button>
        </div>
        
        {/* Color pickers */}
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 items-center">
            <label htmlFor="stroke-color" className="text-sm">Stroke:</label>
            <input
              type="color"
              id="stroke-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
            />
          </div>
          
          <div className="flex gap-1 items-center">
            <label htmlFor="fill-color" className="text-sm">Fill:</label>
            <input
              type="color"
              id="fill-color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
            />
          </div>
        </div>
        
        {/* Brush size */}
        <div className="flex gap-2 items-center">
          <label htmlFor="brush-size" className="text-sm">Size:</label>
          <input
            type="range"
            id="brush-size"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-6">{brushSize}</span>
        </div>
        
        {/* Zoom controls */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
            </svg>
          </button>
          
          <button
            onClick={resetView}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            title="Reset View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.5 1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm-8 4a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm-8 4a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3z"/>
            </svg>
          </button>


          
          <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 items-center">
          <button
            onClick={handleFillColor}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            title="Fill Color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6zM6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13z"/>
            </svg>
          </button>
          
          <button
            onClick={deleteSelected}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
          
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded ${historyIndex <= 0 ? 'bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
            </svg>
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded ${historyIndex >= history.length - 1 ? 'bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            title="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>

          {/*  */}
          <button className='p-2 rounded bg-gray-700 flex items-center hover:bg-gray-600' onClick={saveThePng} title="Save">
            Export <ImageDown className="h-4 w-4 ms-3" /> 
          </button>

          <button className='p-2 rounded bg-gray-700 flex items-center hover:bg-gray-600' onClick={resetCanvas} title="Reset">
            Reset
          </button>
        </div>
      </div>
      
      {/* Furniture panel */}
      <div className="bg-gray-200 p-2 flex gap-2 overflow-x-auto">
        {furnitureItems.map(item => (
          <button
            key={item.type}
            onClick={() => addFurniture(item.type)}
            className="flex flex-col items-center p-2 bg-white rounded shadow hover:bg-gray-100 min-w-[60px]"
            title={item.label}
          >
            <div className="w-8 h-8 mb-1 flex items-center justify-center">
              {item.type === 'chair' && (
                <svg viewBox="0 0 30 30" width="30" height="30">
                  <rect x="5" y="5" width="20" height="20" fill="#f0e68c" />
                  <rect x="10" y="25" width="10" height="5" fill="#8b4513" />
                </svg>
              )}
              {item.type === 'sofa' && (
                <svg viewBox="0 0 80 30" width="30" height="30">
                  <rect x="5" y="5" width="70" height="20" fill="#8b4513" rx="5" />
                  <rect x="10" y="25" width="60" height="5" fill="#654321" />
                </svg>
              )}
              {item.type === 'table' && (
                <svg viewBox="0 0 60 60" width="30" height="30">
                  <rect x="5" y="5" width="50" height="50" fill="#8b4513" />
                  <rect x="15" y="15" width="30" height="30" fill="#f0e68c" />
                </svg>
              )}
              {item.type === 'bed' && (
                <svg viewBox="0 0 80 50" width="30" height="30">
                  <rect x="5" y="5" width="70" height="40" fill="#9370db" rx="5" />
                  <rect x="10" y="10" width="20" height="30" fill="#663399" />
                </svg>
              )}
              {item.type === 'door' && (
                <svg viewBox="0 0 20 40" width="30" height="30">
                  <rect x="0" y="0" width="20" height="40" fill="#8b4513" />
                  <circle cx="15" cy="35" r="2" fill="#000" />
                </svg>
              )}
              {item.type === 'window' && (
                <svg viewBox="0 0 40 10" width="30" height="30">
                  <rect x="0" y="0" width="40" height="10" fill="#add8e6" />
                  <line x1="20" y1="0" x2="20" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="0" y1="5" x2="40" y2="5" stroke="#000" strokeWidth="1" />
                </svg>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Canvas */}
      <div 
        ref={canvasContainerRef}
       
        className="flex-1 overflow-auto bg-white relative"
        onWheel={handleWheel}
      >
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Grid */}
          {renderGrid()}
          
          {/* Elements */}
          {elements.map(renderElement)}
        </svg>
        
        {/* Text input modal */}
        {showTextInput && (
          <div 
            className="absolute bg-white p-2 shadow-lg rounded border border-gray-300"
            style={{ 
              left: `${textPosition.x * scale + offset.x}px`, 
              top: `${textPosition.y * scale + offset.y}px`,
              transform: `scale(${1 / scale})`,
              transformOrigin: '0 0',
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
              autoFocus
              className="border p-1 w-full mb-2"
              placeholder="Enter text..."
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowTextInput(false)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddText}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusEditor;