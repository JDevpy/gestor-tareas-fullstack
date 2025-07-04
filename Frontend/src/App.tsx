// src/App.tsx
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      {/* MainLayout envuelve toda la aplicación, proporcionando el encabezado, pie de página y estructura general */}
      <MainLayout>
        {/* AppRoutes maneja el enrutamiento, renderizando los componentes de página según la URL */}
        <AppRoutes />
      </MainLayout>

      {/* ToastContainer es un componente de react-toastify que muestra notificaciones */}
      {/* Se configura con varias propiedades para controlar su comportamiento y apariencia */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
