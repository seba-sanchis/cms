export interface Transaction {
  _id?: string;
  bank: string | undefined;
  installment: number | undefined;
  paid: number | undefined;
  received: number | undefined;
  overpaid: number | undefined;
}
