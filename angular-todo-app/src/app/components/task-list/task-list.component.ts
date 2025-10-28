import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService, TaskFilters, TaskSortOptions } from '../../services/todo.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  @Input() height = 520;

  readonly TaskPriority = TaskPriority;
  readonly TaskStatus = TaskStatus;

  tasks$!: Observable<Task[]>;

  filters: TaskFilters = { status: 'all' };
  sort: TaskSortOptions = { field: 'updatedAt', direction: 'desc' };

  @Output() selectTask = new EventEmitter<Task>();
  @Output() toggleStatus = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  constructor(private readonly todoService: TodoService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.tasks$ = this.todoService.getFilteredTodos(this.filters, this.sort);
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement)?.value || '';
    this.filters = { ...this.filters, searchQuery: query };
    this.applyFilters();
  }

  onStatusChange(status: TaskStatus | 'all'): void {
    this.filters = { ...this.filters, status };
    this.applyFilters();
  }

  onPriorityChange(priority?: TaskPriority): void {
    this.filters = { ...this.filters, priority };
    this.applyFilters();
  }

  onSortChange(field: TaskSortOptions['field']): void {
    const direction = this.sort.field === field && this.sort.direction === 'desc' ? 'asc' : 'desc';
    this.sort = { field, direction };
    this.applyFilters();
  }

  onSelect(task: Task): void {
    this.selectTask.emit(task);
  }

  onToggleStatus(task: Task, event: Event): void {
    event.stopPropagation();
    this.toggleStatus.emit(task);
  }

  onDelete(task: Task): void {
    this.deleteTask.emit(task);
  }

  onDeleteClick(task: Task, event: Event): void {
    event.stopPropagation();
    if (confirm('Удалить задачу?')) {
      this.onDelete(task);
    }
  }
}


