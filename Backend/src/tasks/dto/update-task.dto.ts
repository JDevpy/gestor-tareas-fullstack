// src/tasks/dto/update-task.dto.ts

// `PartialType` es una utilidad de NestJS (del paquete @nestjs/mapped-types)
// que toma una clase DTO existente y hace que todas sus propiedades sean opcionales.
import { PartialType } from '@nestjs/mapped-types'; 
// Importa el DTO base para la creación de tareas.
import { CreateTaskDto } from './create-task.dto';

// Define la clase UpdateTaskDto.
// Al extender de PartialType(CreateTaskDto), todas las propiedades
// definidas en CreateTaskDto (title, description, completed, tags, dueDate)
// se vuelven opcionales para UpdateTaskDto.
// Esto significa que al actualizar una tarea, no es necesario enviar todos los campos,
// solo aquellos que se desean modificar.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}