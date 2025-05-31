# 🏗️ ArchitechX - 3D Layout Design Platform

![ArchitechX Banner](https://via.placeholder.com/1200x400?text=ArchitechX+Banner)

**ArchitechX** is a full-featured 2D and 3D architectural layout generator built with modern web technologies. It allows users to **design spatial layouts**, **customize wall paints**, and **visualize architectural structures in 3D** — all from a sleek web interface.
## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

ArchitechX is a comprehensive web application for architectural design that enables users to:
- Create 2D floor plans with precision tools
- Visualize designs in interactive 3D
- Customize materials and finishes
- Export professional design documents

## ✨ Features

- 🔐 User authentication with Google OAuth & custom login/signup
- 🧩 2D layout generation based on user inputs (dimensions, room types)
- 🧱 Real-time 3D model rendering using Three.js
- 🎨 Customization of wall colors and textures
- 💾 Project saving, editing, and exporting options
- 🧭 Responsive dashboard with sidebar navigation
- 📁 Reusable templates and layout suggestions
- 📦 Microservice-based backend integration (planned)

---
## 🧭 Project Structure

```bash
frontend/
├── public/                       # Static assets: index.html, favicon, fonts, icons
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   ├── LayoutCanvas.jsx     # Three.js canvas for 3D model
│   │   ├── ColorPicker.jsx      # Wall paint customization
│   │   └── Navbar.jsx
│   │
│   ├── pages/                   
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Editor.jsx           # 3D Editor with customization tools
│   │   └── ExportPage.jsx
│   │
│   ├── services/                
│   │   ├── authService.js       
│   │   ├── userService.js       
│   │   ├── layoutService.js     
│   │   ├── modelService.js      
│   │   ├── customizerService.js 
│   │   └── exportService.js     
│   │
│   ├── hooks/                   # React hooks (e.g. useAuth)
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Main routing config
│   └── index.jsx                # Entry point
│
├── tailwind.config.js           
├── vite.config.js               
└── package.json  



## Route Structure

| Path                        | Component            | Description                   |
|-----------------------------|----------------------|-------------------------------|
| `/`                         | `HomePage`           | Landing page                  |
| `/login`                    | `LoginForm`          | User login                    |
| `/signup`                   | `SignupForm`         | New user registration         |
| `/forgot-password`          | `ForgotPasswordFlow` | Password recovery             |
| `/dashboard`                | `Dashboard`          | User's main dashboard         |
| `/dashboard/profile`        | `Profile`            | Profile management            |
| `/dashboard/create-project` | `CreateNewProject`   | Project initialization        |
| `/dashboard/layout-form`    | `LayoutForm`         | 2D layout input form          |
| `/dashboard/projects`       | `Projects`           | List of saved user projects   |
| `/dashboard/templates`      | `Templates`          | Choose from default templates |
| `/dashboard/dynamic-canvas` | `Editor`             | 3D layout design and edit     |

## Authentication Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant AuthService
    Frontend->>AuthService: POST /auth/login (credentials)
    AuthService-->>Frontend: JWT token
    Frontend->>AuthService: GET /auth/profile (with token)
    AuthService-->>Frontend: User data



### Core Capabilities
```mermaid
graph TD
    A[2D Editor] --> B[3D Visualization]
    B --> C[Material Customization]
    C --> D[Project Sharing]
    D --> E[Export Options]



### Build Options

# Development
npm run dev  # Starts Vite dev server

# Production
npm run build  # Creates optimized build


📜 License
MIT License

Copyright © 2025 ArchitechX Team
