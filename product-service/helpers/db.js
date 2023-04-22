import { Client } from 'pg';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const { RDS_DB_NAME, RDS_PORT, RDS_PASS, RDS_HOST, RDS_USERNAME, AWS_REGION } = process.env;
const rdsConfig = {
  host: RDS_HOST,
  port: RDS_PORT,
  database: RDS_DB_NAME,
  user: RDS_USERNAME,
  password: RDS_PASS,
};

export const getPostgresClient = async () => {
  const client = new Client(rdsConfig);
  await client.connect();
  return client;
};

export const getDynamoDbClient = () => {
  const client = new DynamoDBClient({ region: AWS_REGION });
  return DynamoDBDocumentClient.from(client);
};
