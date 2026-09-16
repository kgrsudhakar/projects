export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "CREATED" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
}