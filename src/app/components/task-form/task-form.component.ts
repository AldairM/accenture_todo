import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';

export interface TaskFormData {
  task?: Task;
  isEditing: boolean;
  categories?: Category[];
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  categories: Category[] = [];
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.isEditing = data.isEditing;
    console.log('TaskFormComponent - Constructor - Data received:', data);
    console.log('TaskFormComponent - Constructor - Categories in data:', data.categories);

    // Access categories from the injected data
    this.categories = data.categories || [];
    console.log('TaskFormComponent - Constructor - Categories loaded:', this.categories.length);

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categoryId: ['']
    });
  }

  ngOnInit(): void {
    console.log('TaskFormComponent - ngOnInit - Categories available:', this.categories.length);
    console.log('TaskFormComponent - ngOnInit - Categories list:', this.categories);

    if (this.isEditing && this.data.task) {
      console.log('TaskFormComponent - ngOnInit - Editing task:', this.data.task);
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description || '',
        categoryId: this.data.task.categoryId || ''
      });
    } else {
      console.log('TaskFormComponent - ngOnInit - Creating new task');
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} debe tener al menos ${control.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} no puede exceder ${control.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    return '';
  }
}