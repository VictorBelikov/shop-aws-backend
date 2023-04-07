import AWS from 'aws-sdk';
import uniqid from 'uniqid';
import { successfulResponse, badResponse } from '../helpers/responses.js';
import { logIncomingRequest } from '../helpers/utils';

const DB = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

export const createProduct = async (event) => {
  try {
    logIncomingRequest(event);

    const { title, description, price, count = 0 } = JSON.parse(event.body);
    const productId = uniqid();
    const product = { id: productId, title, description, price };
    const stock = { product_id: productId, count };

    await DB.put({ TableName: process.env.PRODUCTS_TABLE_NAME, Item: product }).promise();
    await DB.put({ TableName: process.env.STOCKS_TABLE_NAME, Item: stock }).promise();

    return successfulResponse({ message: `product with id: ${productId} successfully created` });
  } catch (e) {
    return badResponse(e);
  }
};
