import { Product } from './product.model';

export interface Item {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
}
