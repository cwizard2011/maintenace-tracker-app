import { Pool } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';
import queries from './dbModel';
import getDbConfig from './databaseConfig';

dotenv.config();
let connectionsString;
const env = process.env.NODE_ENV;

if (env === 'production') {
  connectionsString = process.env.DATABASE_URL_PROD;
}
if (env === 'development') {
  connectionsString = process.env.DATABASE_URL_DEV;
}
if (env === 'test') {
  connectionsString = process.env.DATABASE_URL_TEST;
}

const pool = new Pool(getDbConfig(connectionsString));

pool.query(queries, (err, res) => {
  winston.log('info', (err, res));
});

export default pool;
