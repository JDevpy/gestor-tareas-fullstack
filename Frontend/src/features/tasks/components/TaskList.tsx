// src/features/tasks/components/TaskList.tsx

// Componente principal para mostrar y gestionar la lista de tareas.
// Incluye filtros, ordenamiento, y operaciones CRUD (a través de modales).

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  fetchTasks, // Thunk para cargar tareas
  setSorting, // Acción para cambiar el orden
  deleteTask, // Thunk para eliminar
  updateTask, // Thunk para actualizar
  createTask, // Thunk para crear
} from "../tasksSlice";
import type { SortField, SortOrder } from "../tasksSlice";
import type { Task, TaskFilters } from "../../../types/taskTypes";
import { toast } from "react-toastify"; // Para notificaciones al usuario

import TaskForm from "./TaskForm";

const TaskList: React.FC = () => {
  // --- Hooks de Redux para acceder al estado y despachar acciones ---
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items || []);
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);
  const currentSortField = useAppSelector((state) => state.tasks.sortField);
  const currentSortOrder = useAppSelector((state) => state.tasks.sortOrder);

  // --- Estados locales del componente ---
  // Estado para los filtros de búsqueda, con persistencia en localStorage.
  const [filters, setFilters] = useState<TaskFilters>(() => {
    try {
      const storedFilters = localStorage.getItem("taskFilters");
      return storedFilters
        ? JSON.parse(storedFilters)
        : {
            completed: null,
            dueDateStart: undefined,
            dueDateEnd: undefined,
            tags: undefined,
          };
    } catch (e) {
      console.error("Error al parsear filtros de localStorage:", e);
      return {
        completed: null,
        dueDateStart: undefined,
        dueDateEnd: undefined,
        tags: undefined,
      };
    }
  });

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false); // Controla la visibilidad del modal del formulario
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Tarea a editar (null para crear)

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false); // Visibilidad del modal de confirmación de borrado
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null); // ID de la tarea a eliminar

  // Estados para animaciones del modal de confirmación
  const [shouldRenderConfirmModal, setShouldRenderConfirmModal] =
    useState(false);
  const [animateOutConfirmModal, setAnimateOutConfirmModal] = useState(false);

  // Efecto para controlar la animación del modal de confirmación
  useEffect(() => {
    if (isConfirmDeleteModalOpen) {
      setShouldRenderConfirmModal(true);
      setAnimateOutConfirmModal(false);
    } else {
      setAnimateOutConfirmModal(true);
      const timer = setTimeout(() => {
        setShouldRenderConfirmModal(false);
      }, 300); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [isConfirmDeleteModalOpen]);

  // Función memoizada para obtener tareas con filtros y orden actual
  const fetchTasksWithCurrentFilters = useCallback(() => {
    const combinedParams = {
      ...filters,
      sortField: currentSortField,
      sortOrder: currentSortOrder,
    };
    dispatch(fetchTasks(combinedParams));
  }, [filters, currentSortField, currentSortOrder, dispatch]);

  // Efecto para cargar tareas cuando cambian los filtros o el orden
  useEffect(() => {
    fetchTasksWithCurrentFilters();
  }, [fetchTasksWithCurrentFilters]);

  // --- Manejadores de eventos ---
  // Guarda filtros en localStorage y despacha fetch sin mostrar toast
  const autoApplyFilters = useCallback(() => {
    try {
      localStorage.setItem("taskFilters", JSON.stringify(filters));
      fetchTasksWithCurrentFilters(); // Ya tienes esta función memoizada
    } catch (e) {
      console.error("Error al guardar filtros automáticamente:", e);
    }
  }, [filters, fetchTasksWithCurrentFilters]);

  useEffect(() => {
    autoApplyFilters(); // Aplica filtros cada vez que se cambien
  }, [filters, autoApplyFilters]);

  // Limpia los filtros y recarga las tareas, eliminando de localStorage.
  const handleClearFilters = () => {
    const defaultFilters: TaskFilters = {
      completed: null,
      dueDateStart: undefined,
      dueDateEnd: undefined,
      tags: undefined,
    };
    setFilters(defaultFilters);
    localStorage.removeItem("taskFilters");
    toast.info("Filtros limpiados!");
    fetchTasksWithCurrentFilters();
  };

  // Maneja el cambio en el selector de ordenamiento
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(":");
    dispatch(
      setSorting({ field: field as SortField, order: order as SortOrder })
    );
  };

  // Abre el modal de formulario para editar una tarea
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // Abre el modal de confirmación antes de eliminar
  const handleDeleteClick = (id: number) => {
    setTaskToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  // Confirma y ejecuta la eliminación de una tarea
  const handleConfirmDelete = async () => {
    if (taskToDeleteId !== null) {
      try {
        await dispatch(deleteTask(taskToDeleteId)).unwrap(); // Ejecuta el thunk de eliminación
        toast.success("Tarea eliminada exitosamente!");
      } catch (err: any) {
        toast.error(`Error al eliminar tarea: ${err.message || "Desconocido"}`);
      } finally {
        setIsConfirmDeleteModalOpen(false);
        setTaskToDeleteId(null);
        fetchTasksWithCurrentFilters(); // Recarga las tareas después de eliminar
      }
    }
  };

  // Maneja el envío del formulario (crear o actualizar) desde el modal
  const handleTaskFormSubmitFromModal = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask.id, taskData: taskData })
        ).unwrap();
        toast.success("Tarea actualizada exitosamente!");
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success("Tarea creada exitosamente!");
      }
      setIsTaskFormOpen(false); // Cierra el modal
      setEditingTask(null); // Resetea la tarea en edición
      fetchTasksWithCurrentFilters(); // Recarga las tareas
    } catch (err: any) {
      const errorMessage =
        err.message || err.response?.data?.message || "Error desconocido";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  // Cierra el modal del formulario
  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  // Cierra el modal de confirmación de eliminación
  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setTaskToDeleteId(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12 min-h-screen bg-gray-100">
      {/* Sección de Filtros */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Selector de estado */}
          <div>
            <label
              htmlFor="completedFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="completedFilter"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={
                filters.completed === null
                  ? "null"
                  : filters.completed === true
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  completed:
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                      ? false
                      : null,
                })
              }
              aria-label="Estado"
            >
              <option value="null">Todos</option>
              <option value="true">Completada</option>
              <option value="false">Pendiente</option>
            </select>
          </div>
          {/* Campo de fecha de vencimiento (Desde) */}
          <div>
            <label
              htmlFor="dueDateStart"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vencimiento (Desde)
            </label>
            <input
              type="date"
              id="dueDateStart"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filters.dueDateStart || ""}
              onChange={(e) =>
                setFilters({ ...filters, dueDateStart: e.target.value })
              }
              aria-label="Fecha de Vencimiento (Desde)"
            />
          </div>
          {/* Campo de fecha de vencimiento (Hasta) */}
          <div>
            <label
              htmlFor="dueDateEnd"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vencimiento (Hasta)
            </label>
            <input
              type="date"
              id="dueDateEnd"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filters.dueDateEnd || ""}
              onChange={(e) =>
                setFilters({ ...filters, dueDateEnd: e.target.value })
              }
              aria-label="Fecha de Vencimiento (Hasta)"
            />
          </div>
          {/* Selector de ordenamiento */}
          <div>
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ordenar por
            </label>
            <select
              id="sortOrder"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={`${currentSortField}:${currentSortOrder}`}
              onChange={handleSortChange}
            >
              <option value="id:asc">ID (Asc)</option>
              <option value="id:desc">ID (Desc)</option>
              <option value="title:asc">Título (A-Z)</option>
              <option value="title:desc">Título (Z-A)</option>
              <option value="dueDate:asc">Fecha Vencimiento (Asc)</option>
              <option value="dueDate:desc">Fecha Vencimiento (Desc)</option>
              <option value="createdAt:asc">Fecha Creación (Asc)</option>
              <option value="createdAt:desc">Fecha Creación (Desc)</option>
            </select>
          </div>
        </div>
        {/* Botones de acción de filtros */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-end">
          <button
            onClick={handleClearFilters}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm md:text-base"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Mensajes de estado (carga, error, sin tareas) */}
      {loading && (
        <p className="text-center text-blue-600 text-lg my-8">
          Cargando tareas...
          <span className="animate-spin ml-2 inline-block">🌀</span>
        </p>
      )}
      {error && (
        <div
          className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-8"
          role="alert"
        >
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
      {!loading && tasks.length === 0 && !error && (
        <p className="text-center text-gray-500 text-lg my-8 p-4 bg-white rounded-lg shadow-sm">
          No hay tareas para mostrar con los filtros actuales. ¡Crea una nueva!
        </p>
      )}

      {/* Lista de Tareas (Grid) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-2 rounded-lg bg-white shadow-inner">
        {!loading &&
          !error &&
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col hover:shadow-xl transition-shadow duration-200"
            >
              {/* Título, estado y ID de la tarea */}
              <div className="flex justify-between items-start mb-3">
                <h3
                  className={`text-xl font-bold ${
                    task.completed
                      ? "text-green-700 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                    ID: {task.id}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      task.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </div>
              </div>

              {/* Descripción de la tarea */}
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {task.description || "Sin descripción."}
              </p>

              {/* Detalles de la tarea: Vencimiento, Etiquetas, Creación, Actualización */}
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>
                  <span className="font-medium">Vence:</span>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Etiquetas:</span>{" "}
                  {task.tags && task.tags.length > 0
                    ? task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mr-1 mb-1"
                        >
                          {tag}
                        </span>
                      ))
                    : "Ninguna"}
                </p>
                <p>
                  <span className="font-medium">Creada:</span>{" "}
                  {new Date(task.createdAt).toLocaleString("es-ES")}
                </p>
                {task.updatedAt && (
                  <p>
                    <span className="font-medium">Última act.:</span>{" "}
                    {new Date(task.updatedAt).toLocaleString("es-ES")}
                  </p>
                )}
              </div>

              {/* Botones de acción: Editar y Eliminar */}
              <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => handleEditTask(task)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm md:text-base"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(task.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 text-sm md:text-base"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal del formulario de tarea (crear/editar) */}
      {isTaskFormOpen && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={handleCloseTaskForm}
          onSubmitModal={handleTaskFormSubmitFromModal}
          task={editingTask} // Pasa la tarea a editar (o null para crear)
        />
      )}

      {/* Modal de confirmación de eliminación (con animaciones) */}
      {shouldRenderConfirmModal && (
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 ${
            animateOutConfirmModal ? "animate-fade-out" : "animate-fade-in"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center ${
              animateOutConfirmModal
                ? "animate-modal-pop-out"
                : "animate-modal-pop-in"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseConfirmDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
