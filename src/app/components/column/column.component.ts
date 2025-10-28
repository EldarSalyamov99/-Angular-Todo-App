import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Task, TaskPriority, TaskStatus } from '../../models/task.interface';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {
  @Input() title = '';
  @Input() type: 'priority' | 'done' = 'priority';
  @Input() priority?: TaskPriority;
  @Input() tasks: Task[] = [];
  @Input() dropListId!: string;
  @Input() connectedDropLists: string[] = [];
  @Input() collapsible = false;
  @Input() collapsed = false;

  @Output() dropped = new EventEmitter<{ event: CdkDragDrop<Task[]>, type: 'priority' | 'done', priority?: TaskPriority }>();
  @Output() itemClicked = new EventEmitter<Task>();
  @Output() headerClicked = new EventEmitter<void>();
  @Output() toggleTask = new EventEmitter<{ id: string; newStatus: TaskStatus }>();

  drop(event: CdkDragDrop<Task[]>): void {
    this.dropped.emit({ event, type: this.type, priority: this.priority });
  }

  clickTask(task: Task): void {
    this.itemClicked.emit(task);
  }

  onHeaderClick(): void {
    if (this.collapsible) {
      this.headerClicked.emit();
    }
  }

  toggleTaskStatus(task: Task): void {
    const newStatus: TaskStatus = task.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    this.toggleTask.emit({ id: task.id, newStatus });
  }

  trackById(_: number, item: Task): string { return item.id; }

  getHeaderClass(): string {
    if (this.type === 'done') return 'bg-emerald-900/20 text-emerald-300 border-emerald-800';
    switch (this.priority) {
      case 'high':
        return 'bg-red-900/20 text-red-300 border-red-800';
      case 'medium':
        return 'bg-amber-900/20 text-amber-300 border-amber-800';
      case 'low':
        return 'bg-teal-900/20 text-teal-300 border-teal-800';
      default:
        return '';
    }
  }

  getPanelClass(): string {
    if (this.type === 'done') return 'border-emerald-800';
    switch (this.priority) {
      case 'high':
        return 'border-red-800';
      case 'medium':
        return 'border-amber-800';
      case 'low':
        return 'border-teal-800';
      default:
        return '';
    }
  }
}


