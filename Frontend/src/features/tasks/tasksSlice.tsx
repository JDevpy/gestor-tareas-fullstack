// src/features/tasks/tasksSlice.ts
// Redux slice para manejar el estado de las tareas (lista, carga, errores, ordenamiento).

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters } from "../../types/taskTypes";
import * as tasksApi from "../../api/taskApi"; // Importa funciones de la API de tareas
import { getTasks } from "../../api/taskApi"; // Re-importa getTasks (podría ser removido si * as tasksApi es suficiente)

// Tipos para campos y órdenes de clasificación
export type SortField = "id" | "title" | "dueDate" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

// Define la estructura del estado de las tareas
interface TasksState {
  items: Task[]; // Array de tareas
  loading: boolean; // Indicador de carga
  error: string | null; // Mensaje de error

  sortField: SortField; // Campo actual de ordenamiento
  sortOrder: SortOrder; // Orden actual (asc/desc)
}

// Estado inicial del slice de tareas
const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  sortField: "id",
  sortOrder: "asc",
};

// --- Thunks asíncronos para interactuar con la API ---

// Thunk para obtener tareas, soporta filtros y ordenamiento
export const fetchTasks = createAsyncThunk<
  Task[],
  TaskFilters & { sortField?: SortField; sortOrder?: SortOrder }
>("tasks/fetchTasks", async (filters = {}) => {
  const tasks = await getTasks(filters);
  return tasks;
});

// Thunk para eliminar una tarea por ID
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number, { rejectWithValue }) => {
    try {
      await tasksApi.deleteTask(id);
      return id; // Retorna el ID de la tarea eliminada si es exitoso
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message); // Retorna error
    }
  }
);

// Thunk para crear una nueva tarea
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await tasksApi.createTask(taskData);
      return response; // Retorna la tarea creada
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk para actualizar una tarea existente
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, taskData }: { id: number; taskData: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const response = await tasksApi.updateTask(id, taskData);
      return response; // Retorna la tarea actualizada
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Definición del Slice de Redux ---

const tasksSlice = createSlice({
  name: "tasks", // Nombre del slice
  initialState, // Estado inicial
  reducers: {
    // Reducer síncrono para establecer el ordenamiento
    setSorting: (
      state,
      action: PayloadAction<{ field: SortField; order: SortOrder }>
    ) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
  },
  // Manejo de acciones de los thunks asíncronos (pending, fulfilled, rejected)
  extraReducers: (builder) => {
    builder
      // Casos para fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Casos para deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        // Filtra la tarea eliminada del estado
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // TODO: Añadir casos para createTask y updateTask (pending, fulfilled, rejected)
  },
});

// Exporta las acciones síncronas generadas
export const { setSorting } = tasksSlice.actions;

// Exporta el reducer para ser combinado en el store principal
export default tasksSlice.reducer;
