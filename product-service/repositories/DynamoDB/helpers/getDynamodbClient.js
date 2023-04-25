import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const { AWS_REGION } = process.env;

export const getDynamoDbClient = () => {
  const client = new DynamoDBClient({ region: AWS_REGION });
  return DynamoDBDocumentClient.from(client);
};
