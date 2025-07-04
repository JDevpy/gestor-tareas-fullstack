//src/routes/index.tsx
import { Routes, Route } from "react-router-dom"; // Importa los componentes clave de React Router
import Home from "../pages/Home"; // Importa la página principal (lista de tareas)
import NotFound from "../pages/NotFound"; // Importa la página 404 (no encontrada)
import TaskForm from "../features/tasks/components/TaskForm"; // Importa el formulario de tareas

export default function AppRoutes() {
  return (
    // <Routes> es el contenedor principal para todas las definiciones de ruta
    <Routes>
      {/*
        <Route>: Define una ruta individual.
        - path: La URL que coincidirá con esta ruta.
        - element: El componente que se renderizará cuando la ruta coincida.
      */}
      {/* Ruta para la página de inicio. Muestra la lista de tareas. */}
      <Route path="/" element={<Home />} />
      {/*
        Ruta para crear una nueva tarea.
        Aquí, el componente TaskForm se renderiza como una página completa.
        Nota: Este TaskForm es el mismo componente usado como modal en la página Home,
        pero aquí se utiliza en su modo "página" ya que no se le pasan las props `isOpen` o `onClose`.
      */}
      <Route path="/create-task" element={<TaskForm />} />{" "}
      {/*
        Ruta comodín (*): Coincide con cualquier URL que no haya sido emparejada
        por las rutas anteriores. Ideal para una página "404 No Encontrada".
      */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
