import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Category } from '../../models/category.model';

export interface CategoryFormData {
  category?: Category;
  isEditing: boolean;
}

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent implements OnInit {
  categoryForm: FormGroup;
  isEditing: boolean;
  predefinedColors = [
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#F44336', // Red
    '#00BCD4', // Cyan
    '#FFEB3B', // Yellow
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#E91E63', // Pink
    '#3F51B5', // Indigo
    '#009688'  // Teal
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormData
  ) {
    this.isEditing = data.isEditing;

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      color: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditing && this.data.category) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
        color: this.data.category.color,
        description: this.data.category.description || ''
      });
    } else {
      // Set default color for new categories
      this.categoryForm.patchValue({
        color: this.predefinedColors[0]
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onColorSelect(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.categoryForm.get(fieldName);
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