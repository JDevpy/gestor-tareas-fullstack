// src/types/taskTypes.ts

// Define la estructura de un objeto de Tarea individual
export interface Task {
  id: number;          
  title: string;        
  description: string;  
  completed: boolean;  
  tags: string[] | null | undefined; 
  dueDate: string | null; 
  createdAt: string;    
  updatedAt: string;    
}

// Define la estructura de un objeto utilizado para filtrar tareas
export interface TaskFilters {
  completed?: boolean | null; 
  dueDateStart?: string;      
  dueDateEnd?: string;        
  tags?: string[];            
}