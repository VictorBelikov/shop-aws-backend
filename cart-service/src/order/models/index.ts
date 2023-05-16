import { CartItem } from '../../cart/models';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: string;
  total: number;
};

export type OrderEntity = {
  id?: string;
  user_id: string;
  cart_id: string;
  payment: string; // will be parsed to JSON
  delivery: string; // will be parsed to JSON
  comments: string;
  total: number;
  status: OrderStatus;
};

export const orderTableName = 'orders';

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
}
