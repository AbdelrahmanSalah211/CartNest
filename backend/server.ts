require('dotenv').config();
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import dbConnection from './config/database';
import { globalErrorHandling } from './utils/AppError';
import { Server } from 'http';
import userRoutes from './routes/userRoutes';
// import productRoutes from './routes/productRoutes';


dbConnection().then(() => {
  console.log("Data Source has been initialized!")
})
.catch((err) => {
  console.error("Error during Data Source initialization", err)
});

const app: Express = express();

app.use(cors({
  origin: ['http://localhost:4200', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/products", productRoutes);

app.use(globalErrorHandling);


const port: string = process.env.PORT;
const server: Server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})