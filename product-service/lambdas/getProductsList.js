import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { badResponse, successfulResponse } from '../helpers/responses.js';
import { joinProductsWithStocks, logIncomingRequest } from '../helpers/utils';
import { customError } from '../helpers/errorService';
import { getDynamoDbClient } from '../helpers/db';
import { STATUS_CODE } from '../constants/statusCode';

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;
const dynamoDbClient = getDynamoDbClient();

export const getProductsList = async (event) => {
  logIncomingRequest(event);

  try {
    const productsRequest = dynamoDbClient.send(new ScanCommand({ TableName: PRODUCTS_TABLE_NAME }));
    const stocksRequest = dynamoDbClient.send(new ScanCommand({ TableName: STOCKS_TABLE_NAME }));

    const [products, stocks] = await Promise.all([(await productsRequest).Items, (await stocksRequest).Items]);

    if (!products.length || !stocks.length) {
      throw customError('Assets not found', STATUS_CODE.NOT_FOUND);
    }

    const joinedProducts = joinProductsWithStocks(products, stocks);
    return successfulResponse(joinedProducts);
  } catch (e) {
    return badResponse(e);
  }
};
