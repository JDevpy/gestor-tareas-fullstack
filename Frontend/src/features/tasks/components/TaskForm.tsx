// src/features/tasks/components/TaskForm.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../hooks/hooks";
import { createTask, updateTask } from "../tasksSlice";
import type { Task } from "../../../types/taskTypes";
import { toast } from "react-toastify";

// Define las props del componente TaskForm
interface TaskFormProps {
  isOpen?: boolean; // Si es true, el formulario se renderiza como modal
  onClose?: () => void;
  task?: Task | null;
  onSubmitModal?: (
    // Callback para cuando el formulario se envía en modo modal
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen = false, // Por defecto no es modal
  onClose,
  task,
  onSubmitModal,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Determina si se está editando una tarea o creando una nueva
  const isEditing = !!task;
  // Determina si el formulario se usa como modal
  const isModalMode = isOpen;

  // Estados para controlar las animaciones del modal
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateOut, setAnimateOut] = useState(false);

  // Efecto para gestionar la visibilidad y animaciones del modal
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimateOut(false);
    } else {
      setAnimateOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    title: Yup.string()
      .required("El título es requerido")
      .max(100, "El título no puede exceder los 100 caracteres"),
    description: Yup.string()
      .optional()
      .max(500, "La descripción no puede exceder los 500 caracteres"),
    tags: Yup.string().optional(),
    dueDate: Yup.date()
      .nullable()
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "La fecha de vencimiento no puede ser en el pasado"
      )
      .optional(),
  });

  // Configuración de Formik para el manejo del formulario
  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      completed: task?.completed ?? false,
      tags: task?.tags ? task.tags.join(", ") : "",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true, // Re-inicializa el formulario si 'task' cambia
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Procesa las etiquetas: separa por coma, recorta espacios y filtra vacíos
        const processedTags = values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");

        // Datos de la tarea a enviar
        const taskDataToSubmit = {
          title: values.title,
          description: values.description,
          completed: values.completed,
          tags: processedTags,
          dueDate: values.dueDate ? values.dueDate : null, // Guarda null si no hay fecha
        };

        if (isModalMode) {
          // Si está en modo modal, usa el callback `onSubmitModal`
          if (onSubmitModal) {
            await onSubmitModal(taskDataToSubmit);
          }
        } else {
          // Si no es modal, despacha acciones de Redux directamente y navega
          if (isEditing && task && task.id) {
            await dispatch(
              updateTask({ id: task.id, taskData: taskDataToSubmit })
            ).unwrap(); // Actualiza tarea
            toast.success("Tarea actualizada correctamente!");
          } else {
            await dispatch(createTask(taskDataToSubmit)).unwrap(); // Crea tarea
            toast.success("Tarea creada correctamente!");
          }
          resetForm(); // Limpia el formulario
          navigate("/"); // Navega de vuelta a la lista
        }
      } catch (error: any) {
        console.error("Error al guardar la tarea:", error);
        // Construye un mensaje de error detallado
        const errorMessage =
          error.message ||
          error.response?.data?.message ||
          (isEditing
            ? "Error al actualizar la tarea."
            : "Error al crear la tarea.");
        toast.error(errorMessage);
      } finally {
        setSubmitting(false); // Finaliza el estado de envío
      }
    },
  });

  // Efecto para resetear el formulario cuando se abre o cierra en modo modal/página
  useEffect(() => {
    if (isModalMode) {
      if (isOpen) {
        if (task) {
          // Si hay tarea para editar, precarga los valores
          formik.setValues({
            title: task.title,
            description: task.description || "",
            completed: task.completed,
            tags: task.tags ? task.tags.join(", ") : "",
            dueDate: task.dueDate
              ? new Date(task.dueDate).toISOString().split("T")[0]
              : "",
          });
        } else {
          formik.resetForm(); // Si no hay tarea (creando), resetea
        }
        formik.setTouched({}); // Limpia errores y touched state
        formik.setErrors({});
      }
    } else {
      // En modo página, si no está editando, resetea el formulario
      if (!isEditing) {
        formik.resetForm();
        formik.setTouched({});
        formik.setErrors({});
      }
    }
  }, [isOpen, task, isModalMode]); // Dependencias para re-ejecutar

  // No renderiza el modal si shouldRender es false
  if (!shouldRender && isModalMode) return null;

  // Renderizado condicional: si no es modal, se renderiza como una página
  if (!isModalMode) {
    return (
      <div className="container mx-auto p-4 md:p-8 lg:p-12 bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[70vh]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            {isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Campos del formulario: Título, Descripción, Etiquetas, Fecha, Completada */}
            {/* Campo Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Título:
              </label>
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Título de la tarea"
                required
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.title}
                </div>
              ) : null}
            </div>

            {/* Campo Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Descripción:
              </label>
              <textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                rows={3}
                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Describe la tarea aquí..."
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>

            {/* Campo Etiquetas */}
            <div>
              <label
                htmlFor="tags"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Etiquetas (separadas por coma):
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tags}
                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.tags && formik.errors.tags
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Ej: trabajo, urgente, proyecto"
              />
              {formik.touched.tags && formik.errors.tags ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.tags}
                </div>
              ) : null}
            </div>

            {/* Campo Fecha de Vencimiento */}
            <div>
              <label
                htmlFor="dueDate"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Fecha de Vencimiento:
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dueDate}
                className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.dueDate && formik.errors.dueDate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.dueDate && formik.errors.dueDate ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.dueDate}
                </div>
              ) : null}
            </div>

            {/* Checkbox Completada */}
            <div className="flex items-center">
              <input
                id="completed"
                name="completed"
                type="checkbox"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.completed}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="completed"
                className="ml-2 block text-gray-700 text-sm font-semibold"
              >
                Completada
              </label>
            </div>

            {/* Botones de acción para modo página */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing
                  ? formik.isSubmitting
                    ? "Actualizando..."
                    : "Actualizar Tarea"
                  : formik.isSubmitting
                  ? "Creando..."
                  : "Crear Tarea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Renderizado si está en modo modal
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 ${
        animateOut ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh] ${
          animateOut ? "animate-modal-pop-out" : "animate-modal-pop-in"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          {isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Mismos campos que en el modo página */}
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Título:
            </label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Título de la tarea"
              required
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.title}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Descripción:
            </label>
            <textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={3}
              className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Describe la tarea aquí..."
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Etiquetas (separadas por coma):
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tags}
              className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.tags && formik.errors.tags
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ej: trabajo, urgente, proyecto"
            />
            {formik.touched.tags && formik.errors.tags ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.tags}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Fecha de Vencimiento:
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dueDate}
              className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.dueDate && formik.errors.dueDate
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.dueDate && formik.errors.dueDate ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.dueDate}
              </div>
            ) : null}
          </div>

          <div className="flex items-center">
            <input
              id="completed"
              name="completed"
              type="checkbox"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.completed}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-gray-700 text-sm font-semibold"
            >
              Completada
            </label>
          </div>

          {/* Botones de acción para modo modal */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing
                ? formik.isSubmitting
                  ? "Actualizando..."
                  : "Actualizar Tarea"
                : formik.isSubmitting
                ? "Creando..."
                : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
