// tasks/tasks.model.ts

import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement,
} from 'sequelize-typescript'; // Importa decoradores y tipos de Sequelize-TypeScript
import { Optional } from 'sequelize'; // Importa el tipo Optional de Sequelize

// Interfaz que define todos los atributos de una tarea tal como existen en la base de datos.
export interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  tags: string[];
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo que define los atributos necesarios para crear una tarea,
// marcando 'id', 'createdAt' y 'updatedAt' como opcionales ya que son generados por la DB.
export type TaskCreationAttributes =
  Optional<TaskAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Decorador @Table: Define la tabla de la base de datos y opciones.
@Table({
  tableName: 'tasks',   // Nombre de la tabla en la DB
  timestamps: true,     // Habilita automáticamente las columnas `createdAt` y `updatedAt`
})
// Clase Task: Extiende Model de Sequelize, tipada con TaskAttributes para el modelo y TaskCreationAttributes para la creación.
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {

  // @PrimaryKey: Define la clave primaria.
  // @AutoIncrement: Hace que el ID se auto-incremente.
  // @Column(DataType.INTEGER): Define el tipo de dato de la columna.
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number; // Declaración para TypeScript

  // @Column: Define las propiedades de la columna en la base de datos.
  @Column({ type: DataType.STRING(255), allowNull: false }) // Cadena de hasta 255 caracteres, no puede ser nula.
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true }) // Texto largo, puede ser nulo.
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false }) // Booleano, con valor por defecto false.
  declare completed: boolean;

  @Column({type: DataType.ARRAY(DataType.STRING),  defaultValue: [] }) // Array de strings, con valor por defecto array vacío.
  declare tags: string[];

  @Column({ type: DataType.DATE, allowNull: true }) // Fecha, puede ser nula.
  declare dueDate: Date | null;
}