import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../models/task.interface';

@Pipe({
  name: 'statusDisplay'
})
export class StatusDisplayPipe implements PipeTransform {

  transform(status: TaskStatus | string): string {
    const statusMap: Record<string, string> = {
      'active': 'Активная',
      'completed': 'Завершенная',
      'pending': 'Отложенная',
    };

    return statusMap[status] || 'Неизвестно';
  }
}

@Pipe({
  name: 'statusClass'
})
export class StatusClassPipe implements PipeTransform {

  transform(status: TaskStatus | string): string {
    const classMap: Record<string, string> = {
      'active': 'status-active',
      'completed': 'status-completed',
      'pending': 'status-pending',
    };

    return classMap[status] || 'status-unknown';
  }
}

@Pipe({
  name: 'statusColor'
})
export class StatusColorPipe implements PipeTransform {

  transform(status: TaskStatus | string): string {
    const colorMap: Record<string, string> = {
      'active': '#1890ff',
      'completed': '#52c41a',
      'pending': '#fa8c16',
    };

    return colorMap[status] || '#8c8c8c';
  }
}

