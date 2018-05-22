import { Client } from 'pg';
import dotenv from 'dotenv';


dotenv.config();
const connectionString = process.env.DATABASE_URL;

const queries = [
  "INSERT INTO userlist(username, password, firstName, lastName, email) VALUES ('juliet', 'password1', 'Juliet', 'Samuel', 'sjuliet07@gmail.com')",
  "INSERT INTO userlist(username, password, firstName, lastName, user_role, email) VALUES ('cwizard', 'password2', 'Peter', 'Adeoye', 'admin', 'cwizard2011@gmail.com')",
];

queries.forEach((newQuery) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(newQuery, () => {
    client.end();
  });
});
