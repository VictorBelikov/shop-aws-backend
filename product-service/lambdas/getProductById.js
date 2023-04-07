import AWS from 'aws-sdk';
import { successfulResponse, badResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';
import { joinProductWithStock, logIncomingRequest } from '../helpers/utils';

const DB = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

export const getProductById = async (event) => {
  try {
    logIncomingRequest(event);
    const { productId } = event.pathParameters;

    const { Item: product } = await DB.get({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id: productId },
    }).promise();

    const { Item: stock } = await DB.get({
      TableName: process.env.STOCKS_TABLE_NAME,
      Key: { product_id: productId },
    }).promise();

    if (!product || !stock) {
      throw customError('Assets not found', 404);
    }

    const joinedProduct = joinProductWithStock(product, stock);

    return successfulResponse(joinedProduct);
  } catch (e) {
    return badResponse(e);
  }
};
