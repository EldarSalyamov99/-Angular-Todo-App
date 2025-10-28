import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gmt3Date'
})
export class Gmt3DatePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined, formatString?: string): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return '';
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return '';
    }
  }
}

@Pipe({
  name: 'gmt3Time'
})
export class Gmt3TimePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined, formatString?: string): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return '';
      }

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Ошибка форматирования времени:', error);
      return '';
    }
  }
}

@Pipe({
  name: 'gmt3DateTime'
})
export class Gmt3DateTimePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined, formatString?: string): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return '';
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Ошибка форматирования даты и времени:', error);
      return '';
    }
  }
}

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return '';
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return 'только что';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} мин. назад`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ч. назад`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} дн. назад`;
      } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      }
    } catch (error) {
      console.error('Ошибка форматирования относительного времени:', error);
      return '';
    }
  }
}
