import { Item } from './item.model';
import { Order } from './order.model';
import { Product } from './product.model';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  dni: number;
  birthday: string;
  region: string;
  location: string;
  address: string;
  postcode: number;
  email: string;
  password: string;
  areaCode: number;
  phone: number;
  bag?: Item[];
  favorite?: Product[];
  purchases?: Order[];
}
