// tags/tags.controller.ts

import { Controller, Get } from '@nestjs/common'; // Importa decoradores de NestJS
import { TasksService } from '../tasks/tasks.service'; // Importa el servicio de tareas

@Controller('tags') // Decorador que define que esta clase es un controlador y maneja rutas bajo '/tags'
export class TagsController {
  // El constructor inyecta el TasksService, haciendo que sus métodos estén disponibles para este controlador.
  constructor(private readonly tasksService: TasksService) {}

  @Get() // Decorador que indica que este método manejará solicitudes GET a '/tags'
  async getTags(): Promise<string[]> {
    console.log('GET /api/tags llamado'); // Mensaje de registro para depuración
    // Llama al método getUniqueTags() del TasksService para obtener todas las etiquetas únicas.
    return this.tasksService.getUniqueTags();
  }
}