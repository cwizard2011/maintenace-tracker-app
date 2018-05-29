import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync('password123', salt);

const userlistTable = "DROP TYPE IF EXISTS role CASCADE; CREATE TYPE role AS ENUM ('users', 'admin');DROP TABLE IF EXISTS userlist CASCADE; CREATE TABLE userlist(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(40) NOT NULL, password VARCHAR(255) NOT NULL, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, user_role role default 'users', email VARCHAR(40) NOT NULL, UNIQUE(email, username) );";
const requestTable = "DROP TYPE IF EXISTS status CASCADE;CREATE TYPE status AS ENUM('pending', 'approved', 'rejected', 'resolved');DROP TABLE IF EXISTS requests CASCADE; CREATE TABLE requests(request_id UUID DEFAULT gen_random_uuid(), user_id UUID REFERENCES userlist(id) ON UPDATE CASCADE ON DELETE CASCADE, title VARCHAR(40), currentStatus status default 'pending', details VARCHAR(255), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(request_id, user_id));";
const userlistSeed = `INSERT INTO userlist(id, username, password, firstName, lastName, email) VALUES ('48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'juliet', '${password}', 'Juliet', 'Samuel', 'sjuliet07@gmail.com');INSERT INTO userlist(id, username, password, firstName, lastName, email) VALUES ('48a698a0-1641-5aca-bc1b-de9b1a482ee2', 'peter', '${password}', 'Adeola', 'Samuel', 'petti4eva@yahoo.com');INSERT INTO userlist(username, password, firstName, lastName, user_role, email) VALUES ('cwizard', '${password}', 'Peter', 'Adeoye', 'admin', 'cwizard2011@gmail.com');`;
const requestSeed = "INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e42', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request1', 'new test request', 'pending');INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e45', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request5', 'new test request', 'approved');INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e43', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request2', 'new test request', 'rejected');INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e44', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request3', 'new test request', 'resolved');INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e48', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request7', 'new test request6', 'pending');";
const requestSeed2 = "INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e49', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'request1', 'new test request', 'pending');INSERT INTO requests(request_id, user_id, title, details, currentstatus) VALUES ('0ce529f4-8854-41ec-b67c-fbcb4e716e55', '48a698a0-1641-5aca-bc1b-de9b1a482ee1', 'requestss2435', 'new test request', 'approved');";
const queries = `${userlistTable}${requestTable}${userlistSeed}${requestSeed}${requestSeed2}`;

export default queries;
