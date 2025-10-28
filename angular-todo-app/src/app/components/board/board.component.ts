import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../../models/task.interface';
import { TaskFilters, TaskSortOptions } from '../../services/todo.service';
import { TodoService } from '../../services/todo.service';

interface PriorityColumn {
  id: TaskPriority;
  title: string;
  tasks: Task[];
}

interface DoneColumn {
  id: 'done';
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  columns: PriorityColumn[] = [
    { id: TaskPriority.HIGH, title: 'High', tasks: [] },
    { id: TaskPriority.MEDIUM, title: 'Medium', tasks: [] },
    { id: TaskPriority.LOW, title: 'Low', tasks: [] },
  ];
  doneColumn: DoneColumn = { id: 'done', title: 'Сделано', tasks: [] };

  get connectedIds(): string[] {
    return [...this.columns.map(c => this.getDropListId(c.id)), this.getDropListId('done' as any)];
  }

  editorOpen = false;
  editorTask: Task | null = null;

  private subscription?: Subscription;
  filters: TaskFilters = { status: 'all' } as TaskFilters;
  sort: TaskSortOptions = { field: 'createdAt', direction: 'desc' };

  isMobile = false;
  activeMobileColumn: TaskPriority | 'done' = TaskPriority.HIGH;
  mobileTasks: Task[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.resubscribeToFiltered();
    this.updateIsMobile();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onDrop(event: CdkDragDrop<Task[]>, type: 'priority' | 'done', targetPriority?: TaskPriority): void {
    const previousContainer = event.previousContainer;
    const container = event.container;

    if (previousContainer === container) {
      return;
    }

    transferArrayItem(
      previousContainer.data,
      container.data,
      event.previousIndex,
      event.currentIndex
    );

    const movedTask = container.data[event.currentIndex];
    if (!movedTask) return;

    if (type === 'priority' && targetPriority) {
      const updates: Partial<Task> = {};
      if (movedTask.priority !== targetPriority) {
        updates.priority = targetPriority;
      }
      const fromDone = previousContainer.id === this.getDropListId('done');
      if (fromDone && movedTask.status !== TaskStatus.PENDING) {
        updates.status = TaskStatus.PENDING;
      }
      if (Object.keys(updates).length) {
        this.todoService.updateTodo(movedTask.id, updates).subscribe();
      }
    }

    if (type === 'done') {
      const newStatus = TaskStatus.COMPLETED;
      if (movedTask.status !== newStatus) {
        this.todoService.updateTodo(movedTask.id, { status: newStatus }).subscribe();
      }
    }
  }

  trackById(_: number, item: Task): string { return item.id; }

  getDropListId(priority: TaskPriority | 'done'): string {
    return `drop-${priority}`;
  }

  applyFilters(): void {
    this.resubscribeToFiltered();
  }

  private resubscribeToFiltered(): void {
    this.subscription?.unsubscribe();
    this.subscription = this.todoService.getFilteredTodos(this.filters, this.sort).subscribe(tasks => {
      const pending = tasks.filter(t => t.status === TaskStatus.PENDING);
      const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED);
      this.columns.forEach(col => {
        col.tasks = pending.filter(t => t.priority === col.id);
      });
      this.doneColumn.tasks = completed;
      this.mobileTasks = [...pending, ...completed];
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateIsMobile();
  }

  private updateIsMobile(): void {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  }
  setActiveMobileColumn(id: TaskPriority | 'done'): void {
    this.activeMobileColumn = id;
  }

  openCreate(): void {
    this.editorTask = null;
    this.editorOpen = true;
  }

  openEdit(task: Task): void {
    this.editorTask = task;
    this.editorOpen = true;
  }

  closeEditor(): void {
    this.editorOpen = false;
    this.editorTask = null;
  }

  saveTask(data: { title: string; description?: string; priority: TaskPriority; dueDate?: Date; id?: string }): void {
    if (data.id) {
      this.todoService.updateTodo(data.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate
      }).subscribe(() => this.closeEditor());
    } else {
      this.todoService.createTodo(data.title, data.description || '', data.priority, data.dueDate)
        .subscribe(() => this.closeEditor());
    }
  }

  deleteTask(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => this.closeEditor());
  }

  onToggleTaskStatus(payload: { id: string; newStatus: TaskStatus }): void {
    this.todoService.updateTodo(payload.id, { status: payload.newStatus }).subscribe();
  }
}
