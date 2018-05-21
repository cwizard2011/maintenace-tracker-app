import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);
client.connect();
const role = client.query('CREATE TYPE role AS ENUM (\'users\', \'admin\')');
const status = client.query('CREATE TYPE status AS ENUM (\'new\', \'approved\', \'rejected\', \'pending\', \'resolved\')');
const userList = client.query('CREATE TABLE userlist(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(40) NOT NULL, password VARCHAR(40) NOT NULL, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, user_role role default \'users\', email VARCHAR(40) NOT NULL, UNIQUE(email, username) )');
const requests = client.query('CREATE TABLE requests(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, title VARCHAR(40), currentStatus status default \'new\', details VARCHAR(255), UNIQUE(title), FOREIGN KEY(user_id) REFERENCES userlist(id) )');

const maintenance = [role, status, userList, requests];
let count = maintenance.length;

const endHandler = () => {
  count -= 1;
  if (count === 0) {
    client.end();
  }
};
role.on('end', endHandler);
status.on('end', endHandler);
userList.on('end', endHandler);
requests.on('end', endHandler);
