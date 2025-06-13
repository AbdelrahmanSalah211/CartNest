import { RequestHandler } from "express";

export interface UserInterface {
  signUp: RequestHandler,
  login: RequestHandler,
  updateUser: RequestHandler,
  deleteUser: RequestHandler,
  updatePassword: RequestHandler,
  // forgetPassword: RequestHandler,
  // resetPassword: RequestHandler,
}

export interface OrderInterface {
  createOrder: RequestHandler,
  getAllOrders: RequestHandler,
  rejectOrder: RequestHandler,
  approveOrder: RequestHandler,
  cancelOrder: RequestHandler,
  getUserOrders: RequestHandler,
}

export interface ProductInterface {
  createProduct: RequestHandler,
  getAllProducts: RequestHandler,
  updateProduct: RequestHandler,
  deleteProduct: RequestHandler,
}