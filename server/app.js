import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import requestRoutes from './routes/requests';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import winston from '../config/winston';


const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: winston.stream }));

requestRoutes('/api/v1', app);
userRoutes('/api/v1', app);
adminRoutes('/api/v1', app);

app.listen(port);

export default app;
