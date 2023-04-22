import { getDynamoDbClient } from './helpers/getDynamodbClient';
import { BatchWriteCommand, GetCommand, ScanCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { CustomError } from '../../utils/customError';
import { STATUS_CODE } from '../../constants/statusCode';
import { validateProductData } from '../../utils/validateProductData';
import {
  joinProductsWithStocks,
  joinProductWithStock,
  mapProductsToRequestItems,
  mapProductsToRequestStocks,
} from './helpers/utils';
import uniqid from 'uniqid';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export const DynamoDb = () => {
  const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME, SNS_ARN, AWS_REGION } = process.env;
  const dynamoDbClient = getDynamoDbClient();

  const getAll = async () => {
    const productsRequest = dynamoDbClient.send(new ScanCommand({ TableName: PRODUCTS_TABLE_NAME }));
    const stocksRequest = dynamoDbClient.send(new ScanCommand({ TableName: STOCKS_TABLE_NAME }));

    const [products, stocks] = await Promise.all([(await productsRequest).Items, (await stocksRequest).Items]);

    if (!products.length || !stocks.length) {
      throw CustomError('Assets not found', STATUS_CODE.NOT_FOUND);
    }

    return joinProductsWithStocks(products, stocks);
  };

  const getById = async (id) => {
    const productRequest = dynamoDbClient.send(new GetCommand({ TableName: PRODUCTS_TABLE_NAME, Key: { id } }));
    const stockRequest = dynamoDbClient.send(new GetCommand({ TableName: STOCKS_TABLE_NAME, Key: { product_id: id } }));

    const [product, stock] = await Promise.all([(await productRequest).Item, (await stockRequest).Item]);

    if (!product || !stock) {
      throw CustomError('Assets not found', STATUS_CODE.NOT_FOUND);
    }

    return joinProductWithStock(product, stock);
  };

  const create = async (product) => {
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
    return productId;
  };

  const createBatch = async (records) => {
    const sns = new SNSClient({ region: AWS_REGION });

    const products = records.map(({ body }) => ({ ...JSON.parse(body), id: uniqid() }));

    if (!products.length) {
      throw CustomError('Assets not found', STATUS_CODE.NOT_FOUND);
    }

    const requestProducts = mapProductsToRequestItems(products);
    const requestStocks = mapProductsToRequestStocks(products);

    const productsRequest = dynamoDbClient.send(
      new BatchWriteCommand({
        RequestItems: { [PRODUCTS_TABLE_NAME]: requestProducts },
      }),
    );

    const stocksRequest = dynamoDbClient.send(
      new BatchWriteCommand({ RequestItems: { [STOCKS_TABLE_NAME]: requestStocks } }),
    );

    await Promise.all([await productsRequest, await stocksRequest]);

    const command = new PublishCommand({
      Subject: 'Product Creation',
      Message: JSON.stringify(products),
      MessageAttributes: { createdQuantity: { DataType: 'Number', StringValue: String(products.length) } },
      TopicArn: SNS_ARN,
    });

    await sns.send(command);
    return products;
  };

  return { getAll, getById, create, createBatch };
};
