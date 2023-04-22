import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { successfulResponse, badResponse } from '../helpers/responses.js';
import { logIncomingRequest, validateProductData } from '../helpers/utils';
import { getDynamoDbClient } from '../helpers/db';
import uniqid from 'uniqid';
import { STATUS_CODE } from '../constants/statusCode';

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;
const dynamoDbClient = getDynamoDbClient();

export const createProduct = async (event) => {
  logIncomingRequest(event);

  try {
    const product = JSON.parse(event.body);
    validateProductData(product);
    const { title, description, price, count = 0 } = product;

    const productId = uniqid();
    const newProduct = { id: productId, title, description, price };
    const newStock = { product_id: productId, count };

    const transaction = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            Item: newProduct,
            TableName: PRODUCTS_TABLE_NAME,
          },
        },
        {
          Put: {
            Item: newStock,
            TableName: STOCKS_TABLE_NAME,
          },
        },
      ],
    });

    await dynamoDbClient.send(transaction);
    return successfulResponse({ message: `product with id: ${productId} successfully created` }, STATUS_CODE.CREATED);
  } catch (e) {
    return badResponse(e);
  }
};
