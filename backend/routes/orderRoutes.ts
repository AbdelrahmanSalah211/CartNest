import express from "express";
import orderController from "../controllers/orderController";
import { authenticateUser, authorizeUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.route("/")
  .post(authenticateUser, authorizeUser(['customer']), orderController.createOrder)
  .get(authenticateUser, authorizeUser(['admin']), orderController.getAllOrders);

router.route("/approve/:id")
  .patch(authenticateUser, authorizeUser(['admin']), orderController.approveOrder);

router.route("/reject/:id")
  .patch(authenticateUser, authorizeUser(['admin']), orderController.rejectOrder);

router.route("/cancel/:id")
  .patch(authenticateUser, authorizeUser(['customer']), orderController.cancelOrder);

router.route("/userOrders")
  .get(authenticateUser, authorizeUser(['customer']), orderController.getUserOrders);

export default router;