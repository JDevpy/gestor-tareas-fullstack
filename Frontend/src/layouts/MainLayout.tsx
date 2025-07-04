// src/components/layout/MainLayout.tsx

import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Hooks para navegación

export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate(); // Hook para la navegación programática
  const location = useLocation(); // Hook para obtener la ubicación actual de la ruta
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú móvil

  // Función para manejar la navegación y cerrar el menú móvil si está abierto
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-xl sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          {/* Título de la aplicación */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => handleNavigate("/")} // Navega a la página principal al hacer clic
          >
            Gestor de Tareas
          </h1>

          {/* Botón de Hamburguesa para Móviles (visible solo en pantallas pequeñas) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Alterna el estado del menú móvil
              className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-blue-300 rounded-md p-2 transition-colors duration-200"
              aria-label="Abrir menú" // Accesibilidad
            >
              {isMobileMenuOpen ? (
                // Icono de cerrar (X) cuando el menú está abierto
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                // Icono de hamburguesa cuando el menú está cerrado
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          {/* Navegación para pantallas grandes (visible solo en md y superiores) */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={() => handleNavigate("/")}
                  className={`px-4 py-2 rounded-lg text-lg font-medium relative
                               ${
                                 location.pathname === "/" // Resalta el botón si la ruta actual es "/"
                                   ? "bg-blue-700 text-white shadow-md"
                                   : "text-blue-100 hover:bg-blue-700"
                               }
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 transform hover:scale-105`}
                >
                  Tareas
                  {location.pathname === "/" && ( // Animación de línea inferior para la ruta activa
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-lg animate-fade-in-down"></span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/create-task")}
                  className={`px-4 py-2 rounded-lg text-lg font-medium relative
                               ${
                                 location.pathname === "/create-task" // Resalta el botón si la ruta actual es "/create-task"
                                   ? "bg-blue-700 text-white shadow-md"
                                   : "text-blue-100 hover:bg-blue-700"
                               }
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-300 transform hover:scale-105`}
                >
                  <span className="inline-block mr-1">✨</span> Nueva Tarea
                  {location.pathname === "/create-task" && ( // Animación de línea inferior para la ruta activa
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-lg animate-fade-in-down"></span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú Móvil (visible solo en pantallas pequeñas y cuando está abierto) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen // Clases para controlar la animación de apertura/cierre
              ? "max-h-screen opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav>
            <ul className="flex flex-col space-y-3 p-4 bg-blue-700 rounded-lg shadow-inner">
              <li>
                <button
                  onClick={() => handleNavigate("/")}
                  className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium
                               ${
                                 location.pathname === "/" // Resalta el botón si la ruta actual es "/"
                                   ? "bg-blue-800 text-white"
                                   : "text-blue-100 hover:bg-blue-600"
                               }
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors duration-200`}
                >
                  Tareas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/create-task")}
                  className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium
                               ${
                                 location.pathname === "/create-task" // Resalta el botón si la ruta actual es "/create-task"
                                   ? "bg-blue-800 text-white"
                                   : "text-blue-100 hover:bg-blue-600"
                               }
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors duration-200`}
                >
                  <span className="inline-block mr-1">✨</span> Nueva Tarea
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL - Aquí se renderizarán los componentes hijos (rutas) */}
      <main className="flex-grow container mx-auto py-2 px-4">{children}</main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center p-4 mt-8 shadow-inner">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Gestor de Tareas. Creado por Juan
          Pablo Ignacio Gutiérrez Toro.
          <br className="sm:hidden" />
          <span className="block mt-2 text-xs text-gray-500">
            Prueba Técnica Fullstack - Desarrollador Intermedio
          </span>
        </p>
      </footer>
    </div>
  );
}
