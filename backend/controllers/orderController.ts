import Order, { OrderStatus } from "../models/orderModel"
import { AppError } from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { OrderInterface } from "./interfaces";
import { AppDataSource } from "../config/database";
import { In } from "typeorm"
import User from "../models/userModel";
import Product from "../models/productModel";

export const OrderRepository = AppDataSource.getRepository(Order);

const orderController: OrderInterface = {
  createOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { products } = req.body;
    const { id } = req.user;

    const productsIds = products.map((product: { id: string }) => product.id);

    const order = await AppDataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id } });
      const productsData = await transactionalEntityManager.find(Product, { where: { id: In(productsIds) } });
      const order = transactionalEntityManager.create(Order, {
        user,
        products: productsData
      });
      await transactionalEntityManager.save(order);
      await transactionalEntityManager.decrement(Product, { id: In(productsIds) }, "quantity", 1);
      return order;
    });

    return res.status(201).json({
      status: 'success',
      data: {
        order: order
      }
    });
  }),

  getAllOrders: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderRepository.find({
      where: { status: OrderStatus.PENDING },
      relations: ['products', 'user'],
      order: { id: 'DESC' }
    });

    if (!orders || orders.length === 0) {
      return next(new AppError('No orders found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        orders
      }
    });
  }),

  rejectOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await OrderRepository.findOne({ where: { id: parseInt(id) } });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.status !== OrderStatus.PENDING) {
      return next(new AppError('Order cannot be rejected', 400));
    }

    order.status = OrderStatus.REJECTED;
    await OrderRepository.save(order);

    return res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  }),

  approveOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await OrderRepository.findOne({ where: { id: parseInt(id) } });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.status !== OrderStatus.PENDING) {
      return next(new AppError('Order cannot be approved', 400));
    }

    order.status = OrderStatus.APPROVED;
    await OrderRepository.save(order);

    return res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  }),

  cancelOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await OrderRepository.findOne({ where: { id: parseInt(id) } });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.status !== OrderStatus.PENDING) {
      return next(new AppError('Order cannot be cancelled', 400));
    }

    order.status = OrderStatus.CANCELLED;
    await OrderRepository.save(order);

    return res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  }),

  getUserOrders: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;

    const orders = await OrderRepository.find({
      where: { user: { id }, status: OrderStatus.PENDING },
      relations: ['products'],
      order: { id: 'DESC' }
    });

    if (!orders || orders.length === 0) {
      return next(new AppError('No orders found for this user', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        orders
      }
    });
  }),
}

export default orderController;