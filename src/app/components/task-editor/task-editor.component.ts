import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskPriority } from '../../models/task.interface';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ id?: string; title: string; description?: string; priority: TaskPriority; dueDate?: Date }>();
  @Output() delete = new EventEmitter<string>();

  form!: FormGroup;
  priorities = [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.maxLength(200)]],
      description: [this.task?.description || ''],
      priority: [this.task?.priority || TaskPriority.MEDIUM, Validators.required],
      dueDate: [this.task?.dueDate || null, Validators.required]
    });
  }

  onCancel(): void { this.cancel.emit(); }

  onDelete(): void {
    if (this.task) this.delete.emit(this.task.id);
  }

  onSave(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    const normalizedDueDate = value.dueDate ? new Date(value.dueDate) : undefined;
    this.save.emit({
      id: this.task?.id,
      title: value.title,
      description: value.description,
      priority: value.priority,
      dueDate: normalizedDueDate
    });
  }
}


