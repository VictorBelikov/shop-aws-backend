import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Order, OrderEntity, orderTableName } from '../models';
import { CustomError, getDbPool, getDbClient, TransactionState } from '@shared';
import { CartItem, cartItemsTableName, CartStatus, cartTableName } from '../../cart';

@Injectable()
export class OrderService {
  async findById(orderId: string): Promise<Order> {
    const dbClient = await getDbClient();

    try {
      const {
        rows: [order],
      } = await dbClient.query(`
        select * from ${orderTableName}
        where id = '${orderId}';
      `);

      return { ...order };
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
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

  async update(
    orderId,
    { delivery, payment, comments }: Pick<OrderEntity, 'payment' | 'delivery' | 'comments'>,
  ): Promise<void> {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const dbClient = await getDbClient();

    try {
      await dbClient.query(`
        update ${orderTableName}
        set delivery = '${delivery}',
            payment = '${payment}',
            comments = '${comments}'
        where id = '${orderId}';
      `);
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
  }
}
