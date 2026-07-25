export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  method: 'card' | 'cod';
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export const INDIAN_STATES = [
  'Delhi',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

/** Card fields are normalised as the shopper types so the validation rules stay simple. */
export const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const formatCvv = (value: string): string => value.replace(/\D/g, '').slice(0, 3);
