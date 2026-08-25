export interface Order {
  id: number;
  product_id: number;
  quantity: number;
  total_amount: string;
  status: string;
  created_at: string;
}

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
}