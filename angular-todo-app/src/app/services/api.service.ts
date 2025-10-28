import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Task, 
  TaskPriority, 
  TaskStatus, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskSummary,
  ServerTaskResponse,
  ServerTaskSummaryResponse,
  toTaskId
} from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = 'https://evo-academy.wckz.dev/api';
  private readonly ENDPOINT = `${this.API_BASE_URL}/middle-1`;

  private readonly httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<ServerTaskSummaryResponse[]>(this.ENDPOINT, { headers: this.httpHeaders })
      .pipe(
        map(tasks => tasks.map(summary => this.mapTaskSummaryToTask(summary))),
        catchError(this.handleError)
      );
  }

  getTaskById(id: string): Observable<Task> {
    const url = `${this.ENDPOINT}/${id}`;
    return this.http.get<ServerTaskResponse>(url, { headers: this.httpHeaders })
      .pipe(
        map(task => this.mapServerResponseToTask(task)),
        catchError(this.handleError)
      );
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    const requestBody = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate
    };

    return this.http.post<ServerTaskResponse>(this.ENDPOINT, requestBody, { headers: this.httpHeaders })
      .pipe(
        map(task => this.mapServerResponseToTask(task)),
        catchError(this.handleError)
      );
  }

  updateTask(id: string, updates: UpdateTaskRequest): Observable<Task> {
    const url = `${this.ENDPOINT}/${id}`;
    
    const requestBody = {
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      status: updates.status,
      dueDate: updates.dueDate
    };

    return this.http.patch<ServerTaskResponse>(url, requestBody, { headers: this.httpHeaders })
      .pipe(
        map(task => this.mapServerResponseToTask(task)),
        catchError(this.handleError)
      );
  }

  deleteTask(id: string): Observable<void> {
    const url = `${this.ENDPOINT}/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTaskStatus(id: string, status: TaskStatus): Observable<Task> {
    return this.updateTask(id, { status });
  }

  updateTaskPriority(id: string, priority: TaskPriority): Observable<Task> {
    return this.updateTask(id, { priority });
  }

  getActiveTasks(): Observable<Task[]> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.status === TaskStatus.PENDING))
    );
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.status === TaskStatus.COMPLETED))
    );
  }

  private mapServerResponseToTask(response: ServerTaskResponse): Task {
    return {
      id: toTaskId(response.id),
      title: response.title,
      description: response.description,
      priority: response.priority,
      status: response.status,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      dueDate: response.dueDate ? new Date(response.dueDate) : undefined
    };
  }

  private mapTaskSummaryToTask(summary: ServerTaskSummaryResponse): Task {
    return {
      id: toTaskId(summary.id),
      title: summary.title,
      description: '',
      status: summary.status,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(summary.createdAt),
      updatedAt: new Date(summary.updatedAt)
    };
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
