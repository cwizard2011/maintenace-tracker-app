import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import requestRoutes from './routes/requests';
import userRoutes from './routes/user';


const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

requestRoutes('/api/v1', app);
userRoutes('/api/v1', app);

app.listen(port);

export default app;
