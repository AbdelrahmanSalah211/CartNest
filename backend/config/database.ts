require('dotenv').config();
import { DataSource } from "typeorm";
import User from "../models/userModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import { UserSubscriber } from "../models/userModel";

async function dbConnection() {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    poolSize: 5,
    synchronize: true,
    logging: true,
    entities: [
      User,
      Product,
      Order,
    ],
    subscribers: [
      UserSubscriber,
    ],
  })
  return AppDataSource.initialize();
}

export default dbConnection;