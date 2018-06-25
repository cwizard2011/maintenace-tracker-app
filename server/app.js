import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import requestRoutes from './routes/requests';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import imageRoutes from './routes/imageUpload';
import winston from '../config/winston';


const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: winston.stream }));
app.options('*', cors());
app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to maintenance tracker application board',
    status: 'success',
  });
});
requestRoutes('/api/v1', app);
userRoutes('/api/v1', app);
imageRoutes('/api/v1', app);
adminRoutes('/api/v1', app);

app.all('*', (req, res) => res.status(404).json({
  message: 'Invalid route, please double check your route',
  status: 'fail',
}));

app.listen(port);

export default app;
