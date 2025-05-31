# 🏗️ ArchitechX - 3D Layout Design Platform

![ArchitechX Banner](https://drive.google.com/uc?export=view&id=12BNwr44IYY-blz2peBQsdPNwMGG-NHS3)

**ArchitechX** is a full-featured 2D and 3D architectural layout generator built with modern web technologies. It allows users to **design spatial layouts**, **customize wall paints**, and **visualize architectural structures in 3D** — all from a sleek web interface.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Route Structure](#route-structure)
- [Authentication Flow](#authentication-flow)
- [Core Capabilities](#core-capabilities)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

ArchitechX is a comprehensive web application for architectural design that enables users to:

- Create 2D floor plans with precision tools  
- Visualize designs in interactive 3D  
- Customize materials and finishes  
- Export professional design documents

---

## ✨ Features

- 🔐 User authentication with Google OAuth & custom login/signup
- 🧩 2D layout generation based on user inputs (dimensions, room types)
- 🧱 Real-time 3D model rendering using Three.js
- 🎨 Customization of wall colors and textures
- 💾 Project saving, editing, and exporting options
- 🧭 Responsive dashboard with sidebar navigation
- 📁 Reusable templates and layout suggestions
- 📦 Microservice-based backend integration *(planned)*

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **3D Rendering:** Three.js
- **Authentication:** Firebase Auth / Google OAuth
- **Backend (Planned):** Node.js, Express.js, MongoDB, Docker (microservices)
- **APIs:** RESTful APIs for layout generation and project management

---

## 🗂️ Project Structure


---

## 🌐 Route Structure

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
| `/dashboard/templates`      | `Templates`          | Default layout templates      |
| `/dashboard/dynamic-canvas` | `Editor`             | 3D layout design and edit     |

---



## 🤝 Contributing

1. Fork the project

2. Create a new branch (git checkout -b feature/your-feature)

3. Commit your changes (git commit -m 'Add feature')

4. Push to the branch (git push origin feature/your-feature)

5. Open a Pull Request

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Installation

To install this project run

```bash
git clone https://github.com/aaradhayasingh811/architechx_frontend.git
cd architechx/frontend
```

To install node modules

```bash
npm run install
```


## ⚙️ Configuration


To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## License

MIT License

Copyright © 2025 ArchitechX



