import { Client, ClientConfig, Pool, PoolClient } from 'pg';

const { RDS_DB_NAME, RDS_PORT, RDS_PASS, RDS_HOST, RDS_USERNAME } = process.env;

const rdsConfig: ClientConfig = {
  host: RDS_HOST,
  port: Number(RDS_PORT),
  database: RDS_DB_NAME,
  user: RDS_USERNAME,
  password: RDS_PASS,
};

export enum TransactionState {
  BEGIN = 'BEGIN',
  COMMIT = 'COMMIT',
  ROLLBACK = 'ROLLBACK',
}

export const getDbClient = async (): Promise<Client> => {
  const client = new Client(rdsConfig);
  await client.connect();
  return client;
};

export const getDbPool = async (): Promise<PoolClient> => {
  const pool = new Pool(rdsConfig);
  return await pool.connect();
};
