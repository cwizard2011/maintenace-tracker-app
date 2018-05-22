import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const connectionString = process.env.DATABASE_URL;

const queries = [
  "DROP TYPE IF EXISTS role CASCADE; CREATE TYPE role AS ENUM ('users', 'admin')",
  "DROP TYPE IF EXISTS status CASCADE; CREATE TYPE status AS ENUM ('new', 'approved', 'rejected', 'pending', 'resolved')",
  "DROP TABLE IF EXISTS userlist CASCADE; CREATE TABLE userlist(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(40) NOT NULL, password VARCHAR(255) NOT NULL, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, user_role role default 'users', email VARCHAR(40) NOT NULL, UNIQUE(email, username) )",
  "DROP TABLE IF EXISTS requests CASCADE; CREATE TABLE requests(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, title VARCHAR(40), currentStatus status default 'new', details VARCHAR(255), UNIQUE(title), FOREIGN KEY(user_id) REFERENCES userlist(id) )",
];

queries.forEach((newQuery) => {
  const client = new Client(connectionString);
  client.connect();
  client.query(newQuery, () => {
    client.end();
  });
});
