import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { StorageService } from '../../services/storage.service';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';

@Component({
  selector: 'app-todo-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss'
})
export class TodoContainerComponent {
  // Filter state (public for template access)
  selectedCategoryId = signal<string | undefined>(undefined);
  searchQuery = signal<string>('');

  // Computed filtered tasks
  filteredTasks = computed(() => {
    const tasks = this.storageService.tasks();
    const categoryId = this.selectedCategoryId();
    const query = this.searchQuery().toLowerCase();

    return tasks.filter(task => {
      // Filter by category
      const categoryMatch = !categoryId || task.categoryId === categoryId;

      // Filter by search query
      const searchMatch = !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });
  });

  // Computed statistics - optimized to avoid circular dependencies
  private tasksSignal = computed(() => this.storageService.tasks());

  totalTasks = computed(() => {
    const total = this.tasksSignal().length;
    console.log('TodoContainer - totalTasks computed:', total);
    return total;
  });

  completedTasks = computed(() => {
    const completed = this.tasksSignal().filter(task => task.completed).length;
    console.log('TodoContainer - completedTasks computed:', completed);
    return completed;
  });

  pendingTasks = computed(() => {
    const tasks = this.tasksSignal();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    console.log('TodoContainer - pendingTasks computed:', { total, completed, pending });
    return pending;
  });

  // Reactive category task counts
  categoryTaskCounts = computed(() => {
    const tasks = this.tasksSignal();
    const counts = new Map<string, number>();

    // Count tasks for each category
    tasks.forEach(task => {
      if (task.categoryId) {
        counts.set(task.categoryId, (counts.get(task.categoryId) || 0) + 1);
      }
    });

    console.log('TodoContainer - categoryTaskCounts computed:', Object.fromEntries(counts));
    return counts;
  });

  constructor(
    public storageService: StorageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // Task operations
  onToggleTask(task: Task): void {
    this.storageService.toggleTaskCompletion(task.id);
    this.showSnackBar(
      task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada'
    );
  }

  onDeleteTask(task: Task): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
      this.storageService.deleteTask(task.id);
      this.showSnackBar('Tarea eliminada');
    }
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { task, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storageService.updateTask(task.id, result);
        this.showSnackBar('Tarea actualizada');
      }
    });
  }

  // Category operations
  onCreateCategory(): void {
    const dialogRef = this.dialog.open(CategoryManagerComponent, {
      width: '400px',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storageService.addCategory(result);
        this.showSnackBar('Categoría creada');
      }
    });
  }

  onEditCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryManagerComponent, {
      width: '400px',
      data: { category, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storageService.updateCategory(category.id, result);
        this.showSnackBar('Categoría actualizada');
      }
    });
  }

  onDeleteCategory(category: Category): void {
    const tasksInCategory = this.storageService.getTasksByCategory(category.id);
    if (tasksInCategory.length > 0) {
      this.showSnackBar(
        `No se puede eliminar la categoría. Tiene ${tasksInCategory.length} tareas asignadas.`
      );
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`)) {
      this.storageService.deleteCategory(category.id);
      this.showSnackBar('Categoría eliminada');
    }
  }

  // Filter operations
  onCategoryFilterChange(categoryId: string): void {
    this.selectedCategoryId.set(categoryId === 'all' ? undefined : categoryId);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onCreateTask(): void {
    const categories = this.storageService.categories();
    console.log('TodoContainerComponent - onCreateTask - Categories to pass:', categories.length);
    console.log('TodoContainerComponent - onCreateTask - Categories list:', categories);

    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: {
        isEditing: false,
        categories: categories
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTask: Task = {
          id: this.generateId(),
          title: result.title,
          description: result.description,
          categoryId: result.categoryId,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.storageService.addTask(newTask);
        this.showSnackBar('Tarea creada');
      }
    });
  }

  // Utility methods
  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.storageService.getCategoryById(categoryId);
    return category ? category.name : 'Categoría desconocida';
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return '#9E9E9E';
    const category = this.storageService.getCategoryById(categoryId);
    return category ? category.color : '#9E9E9E';
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  getTasksByCategory(categoryId: string): Task[] {
    const tasks = this.storageService.getTasksByCategory(categoryId);
    console.log('TodoContainer - getTasksByCategory called for categoryId:', categoryId, 'tasks count:', tasks.length);
    return tasks;
  }
}