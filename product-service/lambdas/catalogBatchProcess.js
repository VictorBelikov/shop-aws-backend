import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import uniqid from 'uniqid';
import { badResponse, successfulResponse } from '../helpers/responses';
import { getDynamoDbClient } from '../helpers/db';
import { customError } from '../helpers/errorService';
import { STATUS_CODE } from '../constants/statusCode';
import { mapProductsToRequestItems, mapProductsToRequestStocks } from '../helpers/utils';

const { AWS_REGION, SNS_ARN, PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;
const dynamoDbClient = getDynamoDbClient();
const sns = new SNSClient({ region: AWS_REGION });

export const catalogBatchProcess = async (event) => {
  try {
    const products = event.Records.map(({ body }) => ({ ...JSON.parse(body), id: uniqid() }));

    if (!products.length) {
      throw customError('Assets not found', STATUS_CODE.NOT_FOUND);
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

    return successfulResponse(products, STATUS_CODE.CREATED);
  } catch (e) {
    return badResponse(e);
  }
};
