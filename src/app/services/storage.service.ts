import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TASKS_KEY = 'angular-todo-tasks';
  private readonly CATEGORIES_KEY = 'angular-todo-categories';

  // Signals for reactive state management
  private _tasks = signal<Task[]>([]);
  private _categories = signal<Category[]>([]);

  // Public readonly signals for components to subscribe to
  readonly tasks = this._tasks.asReadonly();
  readonly categories = this._categories.asReadonly();

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultCategories();
  }

  // Task operations
  addTask(task: Task): void {
    console.log('StorageService - addTask called:', task);
    this._tasks.update(tasks => {
      const newTasks = [...tasks, task];
      console.log('StorageService - tasks updated, new length:', newTasks.length);
      return newTasks;
    });
    this.saveTasksToStorage();
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
    this.saveTasksToStorage();
  }

  deleteTask(taskId: string): void {
    console.log('StorageService - deleteTask called for taskId:', taskId);
    this._tasks.update(tasks => {
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      console.log('StorageService - deleteTask, tasks count before:', tasks.length, 'after:', filteredTasks.length);
      return filteredTasks;
    });
    this.saveTasksToStorage();
  }

  toggleTaskCompletion(taskId: string): void {
    console.log('StorageService - toggleTaskCompletion called for taskId:', taskId);
    this._tasks.update(tasks => {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      );
      console.log('StorageService - toggleTaskCompletion, tasks count:', updatedTasks.length);
      const completedCount = updatedTasks.filter(t => t.completed).length;
      console.log('StorageService - toggleTaskCompletion, completed count:', completedCount);
      return updatedTasks;
    });
    this.saveTasksToStorage();
  }

  // Category operations
  addCategory(category: Category): void {
    this._categories.update(categories => [...categories, category]);
    this.saveCategoriesToStorage();
  }

  updateCategory(categoryId: string, updates: Partial<Category>): void {
    this._categories.update(categories =>
      categories.map(category =>
        category.id === categoryId
          ? { ...category, ...updates, updatedAt: new Date() }
          : category
      )
    );
    this.saveCategoriesToStorage();
  }

  deleteCategory(categoryId: string): void {
    // Remove category from storage
    this._categories.update(categories =>
      categories.filter(category => category.id !== categoryId)
    );

    // Remove category assignment from all tasks
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.categoryId === categoryId
          ? { ...task, categoryId: undefined, updatedAt: new Date() }
          : task
      )
    );

    this.saveCategoriesToStorage();
    this.saveTasksToStorage();
  }

  // Utility methods
  getTasksByCategory(categoryId?: string): Task[] {
    if (!categoryId) {
      return this._tasks();
    }
    return this._tasks().filter(task => task.categoryId === categoryId);
  }

  getCategoryById(categoryId: string): Category | undefined {
    return this._categories().find(category => category.id === categoryId);
  }

  private saveTasksToStorage(): void {
    try {
      const tasksToSave = this._tasks().map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      }));
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  private saveCategoriesToStorage(): void {
    try {
      const categoriesToSave = this._categories().map(category => ({
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString()
      }));
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categoriesToSave));
    } catch (error) {
      console.error('Error saving categories to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      // Load tasks
      const tasksData = localStorage.getItem(this.TASKS_KEY);
      if (tasksData) {
        const parsedTasks = JSON.parse(tasksData).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        this._tasks.set(parsedTasks);
      }

      // Load categories
      const categoriesData = localStorage.getItem(this.CATEGORIES_KEY);
      if (categoriesData) {
        const parsedCategories = JSON.parse(categoriesData).map((category: any) => ({
          ...category,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }));
        this._categories.set(parsedCategories);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }

  private initializeDefaultCategories(): void {
    if (this._categories().length === 0) {
      const defaultCategories: Category[] = [
        {
          id: 'default-work',
          name: 'Trabajo',
          color: '#2196F3',
          description: 'Tareas relacionadas con el trabajo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'default-personal',
          name: 'Personal',
          color: '#4CAF50',
          description: 'Tareas personales',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'default-shopping',
          name: 'Compras',
          color: '#FF9800',
          description: 'Lista de compras',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      defaultCategories.forEach(category => this.addCategory(category));
    }
  }

  // Clear all data (useful for testing)
  clearAllData(): void {
    this._tasks.set([]);
    this._categories.set([]);
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
  }
}