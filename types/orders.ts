export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: OrderStatus;
  total: number;
  items: Item[];
  shippingAddress: ShippingAddress;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type Item = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
