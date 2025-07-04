// src/tasks/tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'; // Decorador y excepción de NestJS
import { InjectModel } from '@nestjs/sequelize'; // Decorador para inyectar modelos de Sequelize
import { Op } from 'sequelize'; // Operadores de Sequelize para consultas avanzadas
import { Task } from './task.model'; // Modelo de datos de la tarea
import { CreateTaskDto } from './dto/create-task.dto'; // DTO para crear tareas
import { UpdateTaskDto } from './dto/update-task.dto'; // DTO para actualizar tareas
import { GetTasksFilterDto, SortField, SortOrder } from './dto/get-tasks-filter.dto'; // DTO para filtrar y ordenar tareas

@Injectable() // Decorador que marca esta clase como un proveedor (servicio) inyectable
export class TasksService {
  constructor(
    @InjectModel(Task) // Inyecta el modelo Task de Sequelize para interactuar con la tabla 'tasks'.
    private readonly taskModel: typeof Task,
  ) {}

  // Busca y devuelve todas las tareas, aplicando filtros y ordenamiento.
  async findAll(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const where: any = {}; // Objeto para construir las condiciones WHERE de la consulta
    const order: [SortField, 'ASC' | 'DESC'][] = []; // Array para construir las condiciones ORDER BY

    // Aplica filtro por estado 'completed'.
    if (filterDto.completed !== undefined) {
      where.completed = filterDto.completed;
    }

    // Aplica filtro por rango de fecha de vencimiento.
    if (filterDto.dueDateStart || filterDto.dueDateEnd) {
      where.dueDate = {};
      if (filterDto.dueDateStart) {
        where.dueDate[Op.gte] = new Date(filterDto.dueDateStart); // Mayor o igual que
      }
      if (filterDto.dueDateEnd) {
        const endDate = new Date(filterDto.dueDateEnd);
        endDate.setHours(23, 59, 59, 999); // Ajusta la fecha final al fin del día
        where.dueDate[Op.lte] = endDate; // Menor o igual que
      }
    }

    // Aplica filtro por etiquetas (busca tareas que contengan *al menos una* de las etiquetas dadas).
    if (filterDto.tags && filterDto.tags.length > 0) {
      where.tags = { [Op.overlap]: filterDto.tags }; // Operador OVERLAP para arrays en PostgreSQL
    }

    // Determina el campo y el orden de clasificación, con valores por defecto.
    const sortField: SortField = filterDto.sortField || 'id';
    const sortOrder: SortOrder = filterDto.sortOrder || 'asc';

    // Añade la condición de ordenamiento.
    order.push([sortField, sortOrder.toUpperCase() as 'ASC' | 'DESC']);

    // Registra los filtros y el objeto de consulta para depuración.
    console.log('Filtros recibidos en el servicio (filterDto):', filterDto);
    console.log('Objeto WHERE construido para Sequelize:', where);
    console.log('Objeto ORDER construido para Sequelize:', order);

    // Realiza la consulta a la base de datos con los filtros y el orden.
    return this.taskModel.findAll({
      where,
      order,
    });
  }

  // Busca una sola tarea por su ID.
  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id); // Busca por clave primaria (ID)
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`); // Lanza 404 si no se encuentra
    }
    return task;
  }

  // Crea una nueva tarea.
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Crea una nueva instancia de tarea en la base de datos, mapeando el DTO.
    return this.taskModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description ?? null, // Usa null si undefined
      completed: createTaskDto.completed ?? false, // Usa false si undefined
      tags: createTaskDto.tags ?? [], // Usa array vacío si undefined
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null, // Convierte a Date o null
    });
  }

  // Actualiza una tarea existente por su ID.
  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<[number, Task[]]> { // Retorna [filas afectadas, [tareas actualizadas]]
    const updateData = {
      ...updateTaskDto, // Copia todas las propiedades del DTO
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null, // Asegura el tipo Date para dueDate
    };
    // Realiza la actualización, especificando 'returning: true' para obtener la tarea actualizada.
    return this.taskModel.update(updateData, {
      where: { id },
      returning: true, // Importante para que el segundo elemento del array sea la tarea actualizada
    });
  }

  // Elimina una tarea por su ID.
  async remove(id: number): Promise<void> {
    const task = await this.taskModel.findByPk(id); // Busca la tarea primero
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`); // Lanza 404 si no existe
    }
    await task.destroy(); // Elimina la tarea de la base de datos
  }

  // Obtiene una lista de todas las etiquetas únicas de las tareas.
  async getUniqueTags(): Promise<string[]> {
    // Ejecuta una consulta SQL RAW para obtener las etiquetas únicas de todos los arrays 'tags'.
    const [results] = await this.taskModel.sequelize!.query(`
      SELECT DISTINCT unnest(tags) AS tag FROM tasks WHERE tags IS NOT NULL;
    `);

    // Mapea los resultados de la consulta a un array de strings.
    return (results as Array<{ tag: string }>).map(row => row.tag);
  }
}