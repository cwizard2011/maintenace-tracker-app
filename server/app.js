import express from 'express';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();

const port = process.env.PORT;

const app = express();
app.get('/', (req, res) => res.send('Welcome to maintenance app'));

app.listen(port, () => console.log('Example app listening on port 3000!'));
