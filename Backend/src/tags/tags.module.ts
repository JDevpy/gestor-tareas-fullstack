// tags/tags.module.ts

import { Module } from '@nestjs/common'; // Importa el decorador Module
import { TagsController } from './tags.controller'; // Importa el controlador de etiquetas
import { TasksModule } from '../tasks/tasks.module'; // Importa el módulo de tareas

@Module({
  // `imports`: Lista de módulos que este módulo necesita.
  // TagsModule importa TasksModule porque TagsController (dentro de este módulo)
  // necesita acceder al TasksService (que se provee en TasksModule).
  imports: [TasksModule],

  // `controllers`: Lista de controladores que pertenecen a este módulo.
  // Aquí se registra TagsController para que NestJS pueda mapear sus rutas.
  controllers: [TagsController],
})
export class TagsModule {}