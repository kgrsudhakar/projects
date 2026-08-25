export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  created_at: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
}