import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { successfulResponse, badResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';
import { joinProductWithStock, logIncomingRequest } from '../helpers/utils';
import { getDynamoDbClient } from '../helpers/db';
import { STATUS_CODE } from '../constants/statusCode';

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;
const dynamoDbClient = getDynamoDbClient();

export const getProductById = async (event) => {
  logIncomingRequest(event);

  try {
    const { productId } = event.pathParameters;

    const productRequest = dynamoDbClient.send(
      new GetCommand({ TableName: PRODUCTS_TABLE_NAME, Key: { id: productId } }),
    );

    const stockRequest = dynamoDbClient.send(
      new GetCommand({ TableName: STOCKS_TABLE_NAME, Key: { product_id: productId } }),
    );

    const [product, stock] = await Promise.all([(await productRequest).Item, (await stockRequest).Item]);

    if (!product || !stock) {
      throw customError('Assets not found', STATUS_CODE.NOT_FOUND);
    }

    const joinedProduct = joinProductWithStock(product, stock);
    return successfulResponse(joinedProduct);
  } catch (e) {
    return badResponse(e);
  }
};
