import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../models/task.interface';

@Pipe({
  name: 'priorityDisplay'
})
export class PriorityDisplayPipe implements PipeTransform {

  transform(priority: TaskPriority | string): string {
    const priorityMap: Record<string, string> = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'critical': 'Критический',
    };

    return priorityMap[priority] || 'Неизвестно';
  }
}

@Pipe({
  name: 'priorityClass'
})
export class PriorityClassPipe implements PipeTransform {

  transform(priority: TaskPriority | string): string {
    const classMap: Record<string, string> = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'critical': 'priority-critical',
    };

    return classMap[priority] || 'priority-unknown';
  }
}

@Pipe({
  name: 'priorityColor'
})
export class PriorityColorPipe implements PipeTransform {

  transform(priority: TaskPriority | string): string {
    const colorMap: Record<string, string> = {
      'low': '#52c41a',
      'medium': '#1890ff',
      'high': '#fa8c16',
      'critical': '#f5222d',
    };

    return colorMap[priority] || '#8c8c8c';
  }
}

