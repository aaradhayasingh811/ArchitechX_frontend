import React from 'react'

const Footer = () => {
  return (
    <div>
       <footer className="w-full bg-blue-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2025 ArchitechX. All rights reserved.</p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.675 0h-21.35C.596 0 0 .593 0 1.326v21.348C0 23.405.596 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.405 24 22.674V1.326C24 .593 23.404 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Twitter"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482A13.962 13.962 0 0 1 1.671 3.149a4.917 4.917 0 0 0 1.523 6.563 4.903 4.903 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.9 13.9 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.012 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Instagram"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5c0 3.3-2.45 5.75-5.75 5.75h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
