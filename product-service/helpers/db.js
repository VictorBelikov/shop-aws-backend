import { Client } from 'pg';

const { RDS_DB_NAME, RDS_PORT, RDS_PASS, RDS_HOST, RDS_USERNAME } = process.env;
const dbConfig = {
  host: RDS_HOST,
  port: RDS_PORT,
  database: RDS_DB_NAME,
  user: RDS_USERNAME,
  password: RDS_PASS,
};

export const getPostgresClient = async () => {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
};
