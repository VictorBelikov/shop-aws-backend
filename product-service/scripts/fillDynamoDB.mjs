import AWS from 'aws-sdk';
import { PRODUCTS_TABLE_NAME_DYNAMODB, STOCKS_TABLE_NAME_DYNAMODB } from '../constants/constants.mjs';
import { products } from '../constants/products.mjs';

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });
const DB = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

const mapProductsToRequestItems = (products) => products.map((product) => ({ PutRequest: { Item: product } }));
const mapProductsToRequestStocks = (products) =>
  products.map(({ id }) => ({ PutRequest: { Item: { product_id: id, count: Math.floor(Math.random() * 15) + 1 } } }));

const fillDynamoDB = async () => {
  try {
    const requestItems = mapProductsToRequestItems(products);
    const requestStocks = mapProductsToRequestStocks(products);

    await DB.batchWrite({
      RequestItems: { [PRODUCTS_TABLE_NAME_DYNAMODB]: requestItems },
    }).promise();

    await DB.batchWrite({
      RequestItems: { [STOCKS_TABLE_NAME_DYNAMODB]: requestStocks },
    }).promise();
  } catch (e) {
    console.error('Error: ', e.message);
  }
};

fillDynamoDB();
