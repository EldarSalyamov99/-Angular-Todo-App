import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BoardComponent } from './components/board/board.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';

import * as Pipes from './pipes';

import { TodoService } from './services/todo.service';
import { ApiService } from './services/api.service';
import { HttpErrorInterceptor } from './services/http-error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ColumnComponent,
    TaskCardComponent,
    TaskEditorComponent,
    Pipes.Gmt3DatePipe,
    Pipes.Gmt3TimePipe,
    Pipes.Gmt3DateTimePipe,
    Pipes.RelativeTimePipe,
    Pipes.PriorityDisplayPipe,
    Pipes.PriorityClassPipe,
    Pipes.PriorityColorPipe,
    Pipes.StatusDisplayPipe,
    Pipes.StatusClassPipe,
    Pipes.StatusColorPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ScrollingModule,
    DragDropModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
    })
  ],
  providers: [
    TodoService,
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
