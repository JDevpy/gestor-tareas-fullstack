// tasks/dto/create-task.dto.ts

// Importa decoradores de validación de 'class-validator'
import {
  IsString,    // Valida que la propiedad sea una cadena
  IsBoolean,   // Valida que la propiedad sea un booleano
  IsArray,     // Valida que la propiedad sea un array
  IsOptional,  // Indica que la propiedad es opcional (puede no estar presente)
  IsDateString,// Valida que la propiedad sea una cadena de fecha válida (ISO 8601)
  MaxLength,   // Valida la longitud máxima de una cadena
  MinLength,   // Valida la longitud mínima de una cadena
} from 'class-validator';

// Define la clase CreateTaskDto, que representa la estructura de los datos
// esperados al crear una nueva tarea.
export class CreateTaskDto {
  // `title`: Requerido, debe ser una cadena con longitud entre 3 y 255 caracteres.
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  // `description`: Opcional, si está presente, debe ser una cadena.
  @IsOptional()
  @IsString()
  description?: string;

  // `completed`: Opcional, si está presente, debe ser un booleano.
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  // `tags`: Opcional, si está presente, debe ser un array donde cada elemento es una cadena.
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Valida que cada elemento del array sea un string
  tags?: string[];

  // `dueDate`: Opcional, si está presente, debe ser una cadena de fecha válida.
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}