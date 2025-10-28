import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() toggleStatus = new EventEmitter<void>();

  onToggleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleStatus.emit();
  }
}


