export interface Order {
  _id: string;
  orderId: string | undefined;
  date: string | undefined;
  status: string | undefined;
  picked?: {
    category: string | undefined;
    description: string | undefined;
    sku: string;
    thumbnail: string | undefined;
    quantity: number;
    name: string;
    price: number;
  }[];
  payment?: { company: string | undefined; type: string | undefined };
  payer?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    identification: string | undefined;
    phone?: {
      areaCode: string | undefined;
      number: string | undefined;
      extension?: string | undefined;
    };
  };
  transaction?: {
    bank: string | undefined;
    installment: number | undefined;
    paid: number | undefined;
    received: number | undefined;
    overpaid: number | undefined;
  };
  installments: number | undefined;
  reference: string | undefined;
}
