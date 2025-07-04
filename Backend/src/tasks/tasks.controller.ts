// src/tasks/tasks.controller.ts

import {
  Controller,      // Decorador para definir un controlador
  Get, Post, Put, Delete, // Decoradores para métodos HTTP
  Param, Body,     // Decoradores para extraer parámetros de ruta y cuerpo de solicitud
  NotFoundException, // Excepción HTTP para recursos no encontrados
  HttpCode, HttpStatus, // Para configurar códigos de estado HTTP
  ParseIntPipe,    // Pipe para transformar un parámetro a entero
  Query,           // Decorador para extraer parámetros de consulta
  ValidationPipe,  // Pipe para validar DTOs
} from '@nestjs/common';
import { TasksService } from './tasks.service'; // Servicio que contiene la lógica de negocio de las tareas
import { CreateTaskDto } from './dto/create-task.dto'; // DTO para crear tareas
import { UpdateTaskDto } from './dto/update-task.dto'; // DTO para actualizar tareas
import { Task } from './task.model'; // Modelo de Sequelize para Task
import type { GetTasksFilterDto } from './dto/get-tasks-filter.dto'; // DTO para filtrar tareas

@Controller('tasks') // Define que este controlador maneja rutas bajo el prefijo '/tasks'
export class TasksController {
  // El constructor inyecta el TasksService, haciendo que sus métodos estén disponibles.
  constructor(private readonly tasksService: TasksService) {}

  @Get() // Maneja solicitudes GET a '/tasks'
  // Usa ValidationPipe para validar los parámetros de consulta según GetTasksFilterDto.
  // `transform: true` convierte automáticamente los tipos de cadena a los tipos definidos en el DTO (ej., 'true' a boolean).
  async findAll(@Query(new ValidationPipe({ transform: true })) filterDto: GetTasksFilterDto): Promise<Task[]> {
    // Llama al servicio para obtener todas las tareas, aplicando los filtros.
    return this.tasksService.findAll(filterDto);
  }

  @Get(':id') // Maneja solicitudes GET a '/tasks/:id'
  // ParseIntPipe asegura que 'id' de la URL sea un número.
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      // Si la tarea no se encuentra, lanza una excepción 404.
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    return task;
  }

  @Post() // Maneja solicitudes POST a '/tasks'
  @HttpCode(HttpStatus.CREATED) // Establece el código de estado HTTP 201 (Created) para respuestas exitosas.
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    // Llama al servicio para crear una nueva tarea con los datos del DTO.
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id') // Maneja solicitudes PUT a '/tasks/:id'
  async update(
    @Param('id', ParseIntPipe) id: number, // ID de la tarea a actualizar
    @Body() updateTaskDto: UpdateTaskDto, // Datos para la actualización
  ): Promise<Task> {
    // Llama al servicio para actualizar la tarea. Retorna el número de filas afectadas y la tarea actualizada.
    const [numberOfAffectedRows, [updatedTask]] = await this.tasksService.update(
      id,
      updateTaskDto,
    );

    if (numberOfAffectedRows === 0) {
      // Si no se afectaron filas, la tarea no fue encontrada.
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return updatedTask; // Retorna la tarea actualizada.
  }

  @Delete(':id') // Maneja solicitudes DELETE a '/tasks/:id'
  @HttpCode(HttpStatus.NO_CONTENT) // Establece el código de estado HTTP 204 (No Content) para respuestas exitosas sin cuerpo.
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // Primero, verifica si la tarea existe antes de intentar eliminarla.
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    // Llama al servicio para eliminar la tarea.
    await this.tasksService.remove(id);
  }
}