export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string; // Sử dụng string để dễ dàng xử lý với JSON
  imageUrl: string;
}
