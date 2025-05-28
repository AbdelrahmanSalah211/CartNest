require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { AppError } from "../utils/AppError";
import catchAsync from '../utils/catchAsync';
import { UserInterface } from './interfaces';
import { AppDataSource } from "../config/database";

export const UserRepository = AppDataSource.getRepository(User);

const userController: UserInterface = {
  signUp: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, gender } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64') : null;
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.gender = gender;

    if (photo) {
      const formData = new FormData();
      formData.append('key', process.env.IMGBB_API_KEY);
      formData.append('image', photo);
      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: 'POST',
        body: formData
      });
      if (response.status !== 200) {
        return next(new AppError('Image upload failed', 500));
      }
      const { data } = await response.json();
      user.photo = data.display_url;
      user.deleteURL = data.delete_url;
    }

    await UserRepository.save(user);
    return res.status(201).json({
      status: 'success',
      message: 'User created successfully'
    });
  }),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await UserRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'photo', 'password', 'role']
    });
    if (!user){
      return next(new AppError('Invalid email or password', 401));
    }
    const isPasswordCorrect = await User.correctPassword(user.password, password);
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) }
    );

    return res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        photo: user.photo,
        role: user.role
      }
    });
  }),

  updateUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, gender } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64') : null;
    const { id } = req.user;
    const user = await UserRepository.findOneBy({
      id
    })
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    if(photo){
      const formData = new FormData();
      formData.append('key', process.env.IMGBB_API_KEY);
      formData.append('image', photo);
      const [uploadResponse, deleteResponse] = await Promise.all([
        fetch(`https://api.imgbb.com/1/upload`, {
          method: 'POST',
          body: formData
        }),
        fetch(user.deleteURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      ]);

      if(uploadResponse.status !== 200 && deleteResponse.status !== 200){
        return next(new AppError('User update failed', 500));
      }
      const { data } = await uploadResponse.json();
      user.photo = data.display_url || user.photo;
      user.deleteURL = data.delete_url || user.deleteURL;
    }
    await UserRepository.save(user);
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    console.log(id);
    const user = await UserRepository.delete({
      id
    })
    console.log(id);
    return res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  updatePassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;
    const user = await UserRepository.findOneBy({
      id
    });
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const isPasswordCorrect = await User.correctPassword(user.password, currentPassword);
    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect password', 401));
    }
    user.password = newPassword;
    await UserRepository.save(user);
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN)
    });
    if (!token) {
      return next(new AppError('Error generating token', 500));
    }
    return res.status(200).json({
      status: 'success',
      token
    });
  }),
}


export default userController;