// src/pages/NotFound.tsx

import { useNavigate } from "react-router-dom"; // Importa useNavigate

export default function NotFound() {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleGoHome = () => {
    navigate("/"); // Usa navigate para ir a la ruta raíz
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        404 - Página no encontrada
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        onClick={handleGoHome} // Llama a la función que usa navigate
      >
        Volver a la página principal
      </button>
    </div>
  );
}
