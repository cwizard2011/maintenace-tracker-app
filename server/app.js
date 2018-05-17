import express from 'express';
import dotenv from 'dotenv';
import requestRoutes from './routes/requests';

const app = express();
dotenv.config();

const port = process.env.PORT;

requestRoutes('/api/v1', app);

app.listen(port);

export default app;
