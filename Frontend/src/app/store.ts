// app/store.ts
// Este archivo configura el store central de Redux para la aplicación.
// Es el corazón de la gestión de estado de la aplicación, donde se combinan
// los diferentes "slices" (partes del estado) de Redux.

import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/tasksSlice' // Importa el reducer para el estado de las tareas
import tagsReducer from '../features/tags/tagsSlice'     // Importa el reducer para el estado de las etiquetas

// Configura el store de Redux.
// 'configureStore' de Redux Toolkit simplifica la configuración,
// incluyendo la integración automática de Redux Thunk y Redux DevTools.
export const store = configureStore({
  reducer: {
    // Aquí se definen los diferentes "slices" de estado de la aplicación.
    // Cada clave (ej. 'tasks', 'tags') corresponde a una parte del estado global,
    // y su valor es el reducer que maneja esa parte del estado.
    tasks: tasksReducer, // El estado relacionado con las tareas será manejado por tasksReducer
    tags: tagsReducer,   // El estado relacionado con las etiquetas será manejado por tagsReducer
  },
})

// Define el tipo para el estado raíz de la aplicación.
// 'RootState' representa la forma completa del árbol de estado de Redux.
// Esto es útil para TypeScript para inferir correctamente los tipos cuando
// se accede al estado en los componentes.
export type RootState = ReturnType<typeof store.getState>

// Define el tipo para la función 'dispatch' del store.
// 'AppDispatch' se usa para tipar las acciones que se pueden despachar al store,
// incluyendo acciones asíncronas (thunks).
export type AppDispatch = typeof store.dispatch