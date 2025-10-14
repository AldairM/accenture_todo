import { Routes } from '@angular/router';
import { TodoContainerComponent } from './components/todo-container/todo-container.component';

export const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: TodoContainerComponent },
  { path: '**', redirectTo: '/todo' }
];
