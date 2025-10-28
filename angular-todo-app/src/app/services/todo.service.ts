import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Task, TaskStatus, TaskPriority } from '../models/task.interface';
import { ApiService } from './api.service';

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority;
  searchQuery?: string;
}

export interface TaskSortOptions {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'angular-todo-app-tasks';
  private todosSubject = new BehaviorSubject<Task[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadTasksFromApi();
  }

  loadTasksFromApi(): void {
    this.apiService.getAllTasks().pipe(
      tap(tasks => this.todosSubject.next(tasks)),
      catchError(error => {
        console.error('Ошибка загрузки задач:', error);
        return of([]);
      })
    ).subscribe();
  }

  getTodos(): Observable<Task[]> {
    return this.todos$;
  }

  getTodoById(id: string): Observable<Task | undefined> {
    return this.todos$.pipe(
      map(todos => todos.find(todo => todo.id === id))
    );
  }

  createTodo(title: string, description: string = '', priority: TaskPriority = TaskPriority.MEDIUM, dueDate?: Date): Observable<Task> {
    const taskData = {
      title,
      description,
      priority,
      status: TaskStatus.PENDING,
      dueDate: dueDate ? dueDate.toISOString() : undefined
    };

    return this.apiService.createTask(taskData).pipe(
      tap(task => {
        const currentTasks = this.todosSubject.value;
        this.todosSubject.next([...currentTasks, task]);
      })
    );
  }

  updateTodo(id: string, updates: Partial<Task>): Observable<Task> {
    const taskData: any = {};
    
    if (updates.title !== undefined) taskData.title = updates.title;
    if (updates.description !== undefined) taskData.description = updates.description;
    if (updates.priority !== undefined) taskData.priority = updates.priority;
    if (updates.status !== undefined) taskData.status = updates.status;
    if (updates.dueDate !== undefined) {
      taskData.dueDate = updates.dueDate instanceof Date 
        ? updates.dueDate.toISOString() 
        : updates.dueDate;
    }

    return this.apiService.updateTask(id, taskData).pipe(
      tap(updatedTask => {
        const currentTasks = this.todosSubject.value;
        const taskIndex = currentTasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          const updatedTasks = [...currentTasks];
          updatedTasks[taskIndex] = updatedTask;
          this.todosSubject.next(updatedTasks);
        }
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.apiService.deleteTask(id).pipe(
      tap(() => {
        const currentTasks = this.todosSubject.value;
        const updatedTasks = currentTasks.filter(task => task.id !== id);
        this.todosSubject.next(updatedTasks);
      })
    );
  }

  toggleTodoStatus(id: string): Observable<Task> {
    return this.getTodoById(id).pipe(
      switchMap(todo => {
        if (!todo) {
          throw new Error(`Задача с ID ${id} не найдена`);
        }
        
        const newStatus = todo.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
        
        return this.updateTodo(id, { status: newStatus });
      })
    );
  }

  getFilteredTodos(filters: TaskFilters, sortOptions: TaskSortOptions): Observable<Task[]> {
    return this.todos$.pipe(
      map(tasks => {
        let filteredTasks = [...tasks];

        if (filters.status && filters.status !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }

        if (filters.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
          );
        }

        filteredTasks.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (sortOptions.field) {
            case 'createdAt':
            case 'updatedAt':
              aValue = new Date(a[sortOptions.field]).getTime();
              bValue = new Date(b[sortOptions.field]).getTime();
              break;
            case 'priority':
              const priorityOrder: Record<string, number> = { 
                [TaskPriority.LOW]: 1, 
                [TaskPriority.MEDIUM]: 2, 
                [TaskPriority.HIGH]: 3 
              };
              aValue = priorityOrder[a.priority] || 0;
              bValue = priorityOrder[b.priority] || 0;
              break;
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            default:
              return 0;
          }

          if (sortOptions.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        return filteredTasks;
      })
    );
  }

}
