import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port);

export default app;
