import { Order } from './order.model';
import { Product } from './product.model';

export interface User {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthday: string;
  region: string;
  location: string;
  address: string;
  zip: string;
  areaCode: string;
  phone: string;
  bag?: { product: Product; quantity: number; size?: string }[] | null;
  favorite?: Product[] | null;
  purchases?: Order[] | null;
}
