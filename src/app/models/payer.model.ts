import { Phone } from './phone.model';

export interface Payer {
  _id: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  identification: string | undefined;
  phone?: Phone;
}
