import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Order, OrderEntity, orderTableName } from '../models';
import { CustomError, getDbPool, TransactionState } from '@shared';
import { CartItem, cartItemsTableName, CartStatus, cartTableName } from '../../cart';

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {};

  findById(orderId: string): Order {
    return this.orders[orderId];
  }

  async create(data: OrderEntity, items: CartItem[]): Promise<Order> {
    const dbClient = await getDbPool();

    try {
      const newOrderId = v4();
      const { payment, status, total, comments, delivery, user_id, cart_id } = data;

      await dbClient.query(TransactionState.BEGIN);

      // Create order
      await dbClient.query(`
        insert into ${orderTableName} (id, cart_id, user_id, payment, status, total, comments, delivery)
        values ('${newOrderId}', '${cart_id}', '${user_id}', '${payment}', '${status}', '${total}', '${comments}', '${delivery}');
            
        delete from ${cartItemsTableName}
        where cart_id = '${cart_id}';
      `);

      // Clear cart_items
      await dbClient.query(`
        delete from ${cartItemsTableName}
        where cart_id = '${cart_id}';
      `);

      // Set cart status to 'ORDERED'
      await dbClient.query(`
        update ${cartTableName}
        set status = '${CartStatus.ORDERED}'
        where id = '${cart_id}';
      `);

      await dbClient.query(TransactionState.COMMIT);

      return {
        id: newOrderId,
        cartId: cart_id,
        userId: user_id,
        status,
        total,
        comments,
        items,
        delivery: JSON.parse(delivery),
        payment: JSON.parse(payment),
      };
    } catch (e) {
      await dbClient.query(TransactionState.ROLLBACK);
      throw CustomError(e);
    } finally {
      await dbClient.release();
    }
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[orderId] = {
      ...data,
      id: orderId,
    };
  }
}
