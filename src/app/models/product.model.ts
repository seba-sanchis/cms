export interface Product {
  _id: string;
  sku: string;
  category: string;
  name: string;
  image: string;
  description: string;
  features: string[];
  colors: string;
  sizes: string[];
  stock: number[];
  sold: number[];
  price: number;
}
