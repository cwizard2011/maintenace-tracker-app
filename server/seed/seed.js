import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync('password123', salt);

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const queries = [
  `INSERT INTO userlist(username, password, firstName, lastName, email) VALUES ('juliet', '${password}', 'Juliet', 'Samuel', 'sjuliet07@gmail.com')`,
  `INSERT INTO userlist(username, password, firstName, lastName, user_role, email) VALUES ('cwizard', '${password}', 'Peter', 'Adeoye', 'admin', 'cwizard2011@gmail.com')`,
];

queries.forEach((newQuery) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(newQuery, () => {
    client.end();
  });
});
