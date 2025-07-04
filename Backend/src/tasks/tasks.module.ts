// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';       // Decorador para definir un módulo
import { SequelizeModule } from '@nestjs/sequelize'; // Módulo para integrar Sequelize
import { Task } from './task.model';         // El modelo de Sequelize para las tareas
import { TasksController } from './tasks.controller'; // El controlador de tareas
import { TasksService } from './tasks.service';     // El servicio de tareas

@Module({
  // `imports`: Registra el modelo `Task` con Sequelize para que pueda interactuar con la DB.
  imports: [SequelizeModule.forFeature([Task])],
  // `controllers`: Declara el controlador de este módulo para manejar rutas HTTP.
  controllers: [TasksController],
  // `providers`: Registra el servicio de tareas, haciéndolo inyectable en otros componentes.
  providers: [TasksService],
  // `exports`: Hace que `TasksService` esté disponible para otros módulos que lo importen.
  exports: [TasksService],
})
export class TasksModule {}