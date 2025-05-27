import express from 'express';
import multer from 'multer';

import userController from './../controllers/userController';
import { authenticateUser, authorizeUser } from './../middlewares/authenticateUser';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .patch(
    upload.single('photo'),
    authenticateUser,
    authorizeUser(['customer', 'admin']),
    userController.updateUser
  )
  .delete(authenticateUser, authorizeUser(['customer', 'admin']), userController.deleteUser);

router.post('/signup', upload.single('photo'), userController.signUp);
router.post('/login', userController.login);

router.patch('/updatePassword', authenticateUser, userController.updatePassword);

// router.post('/forgotPassword', userController.forgetPassword);
// router.patch('/resetPassword/:token', userController.resetPassword);

export default router;