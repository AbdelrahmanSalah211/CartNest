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
  getOrder: RequestHandler,
  updateOrder: RequestHandler,
  deleteOrder: RequestHandler,
  approveOrder: RequestHandler,
  deliverOrder: RequestHandler,
  cancelOrder: RequestHandler,
  getUserOrders: RequestHandler,
  getUserOrder: RequestHandler,
}

export interface ProductInterface {
  createProduct: RequestHandler,
  getAllProducts: RequestHandler,
  getProduct: RequestHandler,
  updateProduct: RequestHandler,
  deleteProduct: RequestHandler,
}