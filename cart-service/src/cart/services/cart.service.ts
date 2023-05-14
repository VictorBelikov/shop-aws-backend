import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Cart, cartItemsTableName, CartStatus, cartTableName } from '../models';
import { CustomError, getDbClient } from '@shared';
import AWS from 'aws-sdk';
import { QueryResult } from 'pg';

const lambda = new AWS.Lambda();
const { GET_PRODUCT_LIST_LAMBDA: getProductList } = process.env;

type CartItem = { product_id: string; count: number };
type CartId = { id: string };
type ProductListResponse = { statusCode: number; headers: Record<string, string>; body: string };
type ProductList = { id: string; title: string; description: string; price: number; count: number }[];

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const dbClient = await getDbClient();

    try {
      const {
        rows: [cart],
      }: QueryResult<CartId> = await dbClient.query(`
        select id from ${cartTableName}
        where user_id = '${userId}' and status = '${CartStatus.OPEN}';
      `);

      if (!cart || !cart.id) return undefined;

      const { rows: cartItems }: QueryResult<CartItem> = await dbClient.query(`
        select product_id, count from ${cartItemsTableName}
        where cart_id = '${cart.id}';
      `);

      const { Payload } = await lambda.invoke({ FunctionName: getProductList }).promise();
      const productListResponse: ProductListResponse = JSON.parse(Payload as string);
      const productList: ProductList = JSON.parse(productListResponse.body);

      return {
        id: cart.id,
        items: cartItems.map((cartItem) => ({
          count: cartItem.count,
          product: productList.find(({ id }) => id === cartItem.product_id),
        })),
      };
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
  }

  async createByUserId(userId: string) {
    const dbClient = await getDbClient();

    try {
      const newCartId = v4();

      await dbClient.query(`
        insert into ${cartTableName} (id, user_id, status)
        values ('${newCartId}', '${userId}', '${CartStatus.OPEN}');
      `);

      return await this.findByUserId(userId);
    } catch (e) {
      throw CustomError(e);
    } finally {
      await dbClient.end();
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null;
  }
}
