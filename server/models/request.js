import { Client } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();


const connectionString = process.env.DATABASE_URL;

const queries = [
  "DROP TYPE IF EXISTS status CASCADE; CREATE TYPE status AS ENUM ('new', 'approved', 'rejected', 'pending', 'resolved');",
  "DROP TABLE IF EXISTS requests CASCADE; CREATE TABLE requests(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, title VARCHAR(40), currentStatus status default 'new', details VARCHAR(255), FOREIGN KEY(user_id) REFERENCES userlist(id));",
];

queries.forEach((newQuery) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(newQuery, (err, res) => {
    winston.log(err ? err.stack : res);
    client.end();
  });
});
