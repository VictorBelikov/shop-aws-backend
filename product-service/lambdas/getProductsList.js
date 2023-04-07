import AWS from 'aws-sdk';
import { badResponse, successfulResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';
import { joinProductsWithStocks, logIncomingRequest } from '../helpers/utils';

const DB = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

export const getProductsList = async (event) => {
  try {
    logIncomingRequest(event);

    const { Items: products } = await DB.scan({ TableName: process.env.PRODUCTS_TABLE_NAME }).promise();
    const { Items: stocks } = await DB.scan({ TableName: process.env.STOCKS_TABLE_NAME }).promise();

    if (!products || !stocks) {
      throw customError('Assets not found', 404);
    }

    const joinedProducts = joinProductsWithStocks(products, stocks);

    return successfulResponse(joinedProducts);
  } catch (e) {
    return badResponse(e);
  }
};
