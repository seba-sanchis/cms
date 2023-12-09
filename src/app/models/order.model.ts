import { Payer } from './payer.model';
import { Payment } from './payment.model';
import { Picked } from './picked.model';
import { Transaction } from './transaction.model';

export interface Order {
  _id?: string;
  orderId: string | undefined;
  date: string | undefined;
  status: string | undefined;
  picked?: Picked[];
  payment?: Payment;
  payer?: Payer;
  transaction?: Transaction;
  installments: number | undefined;
  reference: string | undefined;
}
