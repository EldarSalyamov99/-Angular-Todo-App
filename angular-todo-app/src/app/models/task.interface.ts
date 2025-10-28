export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export const TaskStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  readonly id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  dueDate?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ServerTaskResponse {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface ServerTaskSummaryResponse {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export function toTaskId(id: string): string {
  return id;
}

