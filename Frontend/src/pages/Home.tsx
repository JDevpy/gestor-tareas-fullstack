// src/pages/Home.tsx
import React, { useState } from "react"; // Importa React y el hook useState para manejar estados locales.
import TaskList from "../features/tasks/components/TaskList"; // Importa el componente TaskList.
import TaskForm from "../features/tasks/components/TaskForm"; // Importa el componente TaskForm para el modal.
import { useAppDispatch } from "../hooks/hooks"; // Importa el hook de Redux para despachar acciones.
import { createTask } from "../features/tasks/tasksSlice"; // Importa el thunk para crear tareas.
import type { Task } from "../types/taskTypes"; // Importa el tipo de dato 'Task'.
import { toast } from "react-toastify"; // Importa toast para notificaciones al usuario.

const Home: React.FC = () => {
  const dispatch = useAppDispatch(); // Inicializa el dispatcher de Redux.
  // Estado para controlar la visibilidad del modal del formulario de tarea.
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  // Estado para almacenar la tarea que se está editando (null si es una nueva tarea).
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /**
   * Maneja el envío del formulario de tarea desde el modal.
   * Se usa para crear nuevas tareas.
   * @param taskData Datos de la tarea a crear.
   */
  const handleTaskFormSubmitFromModal = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // Despacha la acción para crear la tarea. .unwrap() para manejar errores.
      await dispatch(createTask(taskData)).unwrap();
      toast.success("Tarea creada exitosamente!"); // Muestra notificación de éxito.
      setIsTaskFormOpen(false); // Cierra el modal al finalizar.
    } catch (err: any) {
      // Captura y muestra errores de la operación.
      const errorMessage =
        err.message || err.response?.data?.message || "Error desconocido";
      toast.error(`Error al crear tarea: ${errorMessage}`);
    }
  };

  /**
   * Cierra el modal del formulario de tarea y resetea la tarea en edición.
   */
  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false); // Cierra el modal.
    setEditingTask(null); // Resetea la tarea en edición.
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Renderiza el componente TaskList.
          No se le pasa la prop 'onEdit' porque TaskList ahora maneja su propia lógica
          de edición y apertura de modal internamente. */}
      <TaskList />

      {/* Renderiza el modal de TaskForm solo si 'isTaskFormOpen' es true.
          Se usa para la creación de tareas iniciada desde Home. */}
      {isTaskFormOpen && (
        <TaskForm
          isOpen={isTaskFormOpen} // Controla si el modal está abierto.
          onClose={handleCloseTaskForm} // Función para cerrar el modal.
          onSubmitModal={handleTaskFormSubmitFromModal} // Función que maneja el envío del formulario.
          task={editingTask} // Pasa null (para crear) o la tarea a editar (si se usara para editar desde Home).
        />
      )}
    </div>
  );
};

export default Home;
