import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(clonedRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('HTTP Success:', event.url, event.status);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (error.error instanceof ErrorEvent) {
          console.error('Ошибка сети. Проверьте подключение к интернету');
        } else {
          switch (error.status) {
            case 400:
              console.error('Неверный запрос. Проверьте данные');
              break;
            case 401:
              console.error('Не авторизован');
              break;
            case 403:
              console.error('Доступ запрещен');
              break;
            case 404:
              console.error('Задача не найдена');
              break;
            case 500:
              console.error('Внутренняя ошибка сервера');
              break;
            case 0:
              console.error('Не удалось подключиться к серверу');
              break;
            default:
              console.error(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
          }
        }

        return throwError(() => error);
      })
    );
  }
}
