// src/tasks/dto/get-tasks-filter.dto.ts

import { IsOptional, IsBooleanString, IsDateString, IsArray, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer'; // Importa el decorador Transform

// Define los tipos permitidos para el campo de ordenamiento
export type SortField = 'id' | 'title' | 'dueDate' | 'createdAt' | 'updatedAt';
// Define los tipos permitidos para el orden de ordenamiento
export type SortOrder = 'asc' | 'desc';

// Define la clase GetTasksFilterDto para los parámetros de filtrado y ordenamiento
export class GetTasksFilterDto {
  @IsOptional() // La propiedad es opcional
  @IsBooleanString() // Valida que la cadena represente un booleano ('true' o 'false')
  // Transforma la cadena 'true' a booleano true, cualquier otra cosa a false.
  @Transform(({ value }) => value === 'true')
  completed?: boolean; // Filtra tareas por estado de completitud

  @IsOptional()
  @IsDateString() // Valida que la cadena sea un formato de fecha válido
  dueDateStart?: string; // Fecha de inicio para filtrar por rango de fecha de vencimiento

  @IsOptional()
  @IsDateString() // Valida que la cadena sea un formato de fecha válido
  dueDateEnd?: string; // Fecha de fin para filtrar por rango de fecha de vencimiento

  @IsOptional()
  @IsArray() // Valida que sea un array
  @IsString({ each: true }) // Valida que cada elemento del array sea un string
  tags?: string[]; // Filtra tareas que contengan alguna de las etiquetas especificadas

  @IsOptional()
  @IsString()
  // Valida que el valor de la cadena esté dentro de un conjunto predefinido de opciones
  @IsIn(['id', 'title', 'dueDate', 'createdAt', 'updatedAt'])
  sortField?: SortField; // Campo por el cual ordenar los resultados

  @IsOptional()
  @IsString()
  // Valida que el valor de la cadena esté dentro de un conjunto predefinido de opciones
  @IsIn(['asc', 'desc'])
  sortOrder?: SortOrder; // Orden de la clasificación (ascendente o descendente)
}