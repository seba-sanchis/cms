import { Account } from './account.model';
import { Item } from './item.model';
import { Order } from './order.model';
import { Privacy } from './privacy.model';
import { Product } from './product.model';
import { Shipping } from './shipping.model';

export interface User {
  _id: string;
  account: Account;
  privacy: Privacy;
  shipping: Shipping;
  bag?: Item[] | null;
  favorite?: Product[] | null;
  purchases?: Order[] | null;
}
