// src/api/taskApi.ts
// Este archivo se encarga de toda la comunicación con la API del backend
// para las operaciones relacionadas con las tareas (CRUD).

import type { TaskFilters } from "../types/taskTypes";
import type { SortField, SortOrder } from "../features/tasks/tasksSlice";

// Define la URL base de la API. Toma el valor de una variable de entorno
// o usa un valor por defecto si no está definida.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Función auxiliar para manejar las respuestas de la API.
 * Verifica si la respuesta fue exitosa y parsea el JSON,
 * o lanza un error si hubo algún problema.
 * Si la respuesta es un 204 (No Content), devuelve null.
 */
async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorData = null;
    try {
      // Intenta obtener el mensaje de error del cuerpo de la respuesta
      errorData = await res.json();
    } catch (e) {
      // Si no se puede parsear JSON, usa el texto de estado HTTP
      errorData = { message: res.statusText };
    }
    // Lanza un error con el mensaje obtenido
    throw new Error(errorData.message || 'Error desconocido del servidor');
  }

  // Si la respuesta es 204 (No Content), no hay cuerpo que parsear
  if (res.status === 204) {
    return null;
  }

  // Devuelve el cuerpo de la respuesta como JSON
  return res.json();
}

// Define los parámetros que se pueden usar para filtrar y ordenar tareas
interface GetTasksParams extends TaskFilters {
  sortField?: SortField;
  sortOrder?: SortOrder;
}

/**
 * Obtiene una lista de tareas del backend, aplicando filtros y ordenamiento si se especifican.
 * Construye una URL con parámetros de consulta basados en los filtros.
 */
export async function getTasks(params: GetTasksParams = {}) {
  let queryString = '';
  const urlParams = new URLSearchParams();

  // Añade los parámetros de filtro y ordenamiento a la URL
  if (params.completed !== undefined && params.completed !== null) {
    urlParams.append('completed', String(params.completed));
  }
  if (params.dueDateStart) {
    urlParams.append('dueDateStart', params.dueDateStart);
  }
  if (params.dueDateEnd) {
    urlParams.append('dueDateEnd', params.dueDateEnd);
  }
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => urlParams.append('tags', tag));
  }
  if (params.sortField) {
    urlParams.append('sortField', params.sortField);
  }
  if (params.sortOrder) {
    urlParams.append('sortOrder', params.sortOrder);
  }

  // Si hay parámetros, construye la cadena de consulta
  if (urlParams.toString()) {
    queryString = `?${urlParams.toString()}`;
  }

  // Realiza la petición GET a la API y maneja la respuesta
  const response = await fetch(`${API_URL}/tasks${queryString}`);
  const data = await handleResponse(response);

  // Normaliza la estructura de la respuesta para asegurar que siempre sea un array de tareas
  if (Array.isArray(data)) {
    return data; 
  } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
    // Si la API devuelve un objeto con una propiedad 'data' que es un array
    return data.data;
  } else {
    // Si la estructura es inesperada, loguea un error y devuelve un array vacío
    console.error('Estructura de respuesta inesperada de la API para getTasks:', data);
    return [];
  }
}

/**
 * Envía una nueva tarea al backend para ser creada.
 * Realiza una petición POST con los datos de la tarea en el cuerpo.
 */
export async function createTask(taskData: any) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // Indica que el cuerpo es JSON
    body: JSON.stringify(taskData), // Convierte los datos a JSON string
  });
  // Maneja la respuesta y devuelve los datos de la tarea creada
  const data = await handleResponse(response);
  return data;
}

/**
 * Actualiza una tarea existente en el backend.
 * Realiza una petición PUT al endpoint de la tarea específica por su ID.
 */
export async function updateTask(id: number, data: any) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // Maneja la respuesta y devuelve los datos de la tarea actualizada
  const result = await handleResponse(response);
  return result;
}

/**
 * Elimina una tarea del backend.
 * Realiza una petición DELETE al endpoint de la tarea específica por su ID.
 */
export async function deleteTask(id: number) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  // Maneja la respuesta (no se espera contenido) y devuelve el ID de la tarea eliminada
  await handleResponse(response);
  return id;
}