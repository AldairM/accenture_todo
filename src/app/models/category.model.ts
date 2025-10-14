export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  description?: string;
}