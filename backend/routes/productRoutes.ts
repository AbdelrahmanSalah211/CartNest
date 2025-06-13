import express from "express";
import multer from "multer";

import productController from "../controllers/productController";
import { authenticateUser, authorizeUser } from "./../middlewares/authenticateUser";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    upload.single('image'),
    authenticateUser,
    authorizeUser(['admin']),
    productController.createProduct
  );

router
  .route("/:postId")
  .patch(
    upload.single('image'),
    authenticateUser,
    authorizeUser(['admin']),
    productController.updateProduct
  )
  .delete(authenticateUser, authorizeUser(['admin']), productController.deleteProduct);

export default router;
