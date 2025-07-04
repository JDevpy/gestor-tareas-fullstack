// features/tags/tagsSlice.ts
// Este archivo define una "rebanada" (slice) de Redux para manejar el estado de las etiquetas (tags).
// Usando Redux Toolkit, simplifica la creación de reducers y acciones para una parte específica del estado global.

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'; 

// Define la estructura del estado para las etiquetas.
// En este caso, es un array de strings, donde cada string es una etiqueta.
interface TagState {
  tags: string[] // 'tags' será un array que contendrá todas las etiquetas disponibles.
}

// Define el estado inicial para esta "rebanada" de etiquetas.
// Al principio, el array de etiquetas estará vacío.
const initialState: TagState = {
  tags: [],
}

// Crea la "rebanada" de Redux para las etiquetas.
// 'createSlice' genera automáticamente acciones y un reducer basado en el nombre y los reducers definidos.
export const tagsSlice = createSlice({
  name: 'tags', // Nombre de esta "rebanada" del estado. Se usará como prefijo para los nombres de acción (ej. 'tags/setTags').
  initialState, // El estado inicial definido anteriormente.
  reducers: {
    // Aquí se definen las funciones que "mutan" el estado de forma inmutable (gracias a Immer, incluido en Redux Toolkit).
    // Cada función es un "caso" de un reducer que responde a una acción específica.
    setTags(state, action: PayloadAction<string[]>) {
      // Cuando se despacha la acción 'setTags', el 'payload' (carga útil) de la acción
      // se asigna directamente al array 'tags' en el estado.
      // Esto permite reemplazar la lista actual de etiquetas con una nueva.
      state.tags = action.payload
    },
  },
})

// Exporta las acciones generadas automáticamente por 'createSlice'.
// 'setTags' es una "action creator" que puedes usar en tus componentes
// para despachar la acción que actualiza las etiquetas.
export const { setTags } = tagsSlice.actions

// Exporta el reducer generado automáticamente.
// Este reducer se combinará en el store principal de Redux (en 'app/store.ts')
// para manejar la parte del estado correspondiente a las etiquetas.
export default tagsSlice.reducer