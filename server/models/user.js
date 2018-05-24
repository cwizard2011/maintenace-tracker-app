import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();


const connectionString = process.env.DATABASE_URL;

const queries = [
  "DROP TYPE IF EXISTS role CASCADE; CREATE TYPE role AS ENUM ('users', 'admin');",
  "DROP TABLE IF EXISTS userlist CASCADE; CREATE TABLE userlist(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(40) NOT NULL, password VARCHAR(255) NOT NULL, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, user_role role default 'users', email VARCHAR(40) NOT NULL, UNIQUE(email, username) );",
];

queries.forEach((newQuery) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(newQuery, (err, res) => {
    winston.log(err ? err.stack : res);
    client.end();
  });
});
