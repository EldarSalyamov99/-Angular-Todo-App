# Angular Todo App

## Запуск проекта

### Предварительные требования
- Node.js (версия 16 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
ng serve
```
Приложение будет доступно по адресу `http://localhost:4200/`

### Сборка для продакшена
```bash
ng build
```

Приложение интегрировано с бэкенд API:
- **Base URL**: `https://evo-academy.wckz.dev`
- **Endpoints**:
  - `GET /api/middle-1` - получить список задач
  - `GET /api/middle-1/{uuid}` - получить задачу по ID
  - `POST /api/middle-1` - создать новую задачу
  - `PATCH /api/middle-1/{uuid}` - обновить задачу
  - `DELETE /api/middle-1/{uuid}` - удалить задачу
