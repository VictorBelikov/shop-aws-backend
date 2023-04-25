import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { PRODUCTS_TABLE_NAME_DYNAMODB, STOCKS_TABLE_NAME_DYNAMODB } from '../constants/constants.mjs';
import { products } from '../mocks/products.mjs';

const getDynamoDbClient = () => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromIni({ profile: process.env.AWS_PROFILE }),
  });
  return DynamoDBDocumentClient.from(client);
};

const mapProductsToRequestItems = (products) => products.map((product) => ({ PutRequest: { Item: product } }));

const mapProductsToRequestStocks = (products) =>
  products.map(({ id }) => ({ PutRequest: { Item: { product_id: id, count: Math.floor(Math.random() * 15) + 1 } } }));

const dynamoDbClient = getDynamoDbClient();

const fillDynamoDB = async () => {
  try {
    const requestProducts = mapProductsToRequestItems(products);
    const requestStocks = mapProductsToRequestStocks(products);

    const productsRequest = dynamoDbClient.send(
      new BatchWriteCommand({
        RequestItems: { [PRODUCTS_TABLE_NAME_DYNAMODB]: requestProducts },
      }),
    );

    const stocksRequest = dynamoDbClient.send(
      new BatchWriteCommand({ RequestItems: { [STOCKS_TABLE_NAME_DYNAMODB]: requestStocks } }),
    );

    await Promise.all([await productsRequest, await stocksRequest]);
  } catch (e) {
    console.error('Error: ', e.message);
  }
};

fillDynamoDB();
