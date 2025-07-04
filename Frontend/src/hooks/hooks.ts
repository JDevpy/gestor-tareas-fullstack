// hooks/hooks.ts

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux'; 
import type { RootState, AppDispatch } from '../app/store'; // Importa los tipos de tu store

// useAppDispatch: Hook tipado para obtener la función 'dispatch' de Redux.
// Permite despachar acciones con el tipado correcto de 'AppDispatch'.
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector: Hook tipado para seleccionar partes del estado de Redux.
// Garantiza que el selector reciba y devuelva tipos seguros basados en 'RootState'.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;