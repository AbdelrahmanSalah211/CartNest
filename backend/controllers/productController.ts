import Product from "../models/productModel"
import { AppError } from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { ProductInterface } from "./interfaces";
import { AppDataSource } from "../config/database";
import { APIFeatures } from "../utils/APIFeatures";

export const ProductRepository = AppDataSource.getRepository(Product);

const productController: ProductInterface = {
  createProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, details, quantity, price } = req.body;

    const image = req.file ? req.file.buffer.toString('base64') : null;

    const product = new Product();
    product.title = title;
    product.details = details;
    product.quantity = quantity;
    product.price = price;

    if(image) {
      const formData = new FormData();
      formData.append('key', process.env.IMGBB_API_KEY);
      formData.append('image', image);
      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: 'POST',
        body: formData
      });

      if(response.status !== 200){
        return next(new AppError('Image upload failed', 500));
      }

      const { data } = await response.json();
      product.image = data.display_url;
      product.deleteURL = data.delete_url;
    }
    await ProductRepository.save(product);
    return res.status(201).json({
      status: 'success',
      data: {
        product: product
      }
    });
  }),


  getAllProducts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productsQB = AppDataSource.getRepository(Product).createQueryBuilder('product');

    const features = new APIFeatures(productsQB, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.getQuery().getMany();
    if (!products) {
      return next(new AppError('No products found', 404));
    }
    return res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  }),

  updateProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, details, quantity, price } = req.body;
    const { productId } = req.params;
    const Product = await ProductRepository.findOne({
      where: { id: parseInt(productId, 10) }
    });
    if (!Product) {
      return next(new AppError('Product not found', 404));
    }
    Product.title = title;
    Product.details = details;
    Product.quantity = quantity;
    Product.price = price;
    if(req.file){
      const file = req.file.buffer.toString('base64');
      const formData = new FormData();
      formData.append('key', process.env.IMGBB_API_KEY as string);
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload`, {
        method: 'POST',
        body: formData
      });
      if(response.status !== 200){
        return next(new AppError('Product not updated', 500));
      }
      const { data } = await response.json();
      if(Product.deleteURL){
        const deleteResponse = await fetch(Product.deleteURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if(deleteResponse.status !== 200){
          return next(new AppError('Product not updated', 500));
        }
      }
      Product.image = data.display_url;
      Product.deleteURL = data.delete_url;
    }
    await  ProductRepository.save(Product);
    return res.status(200).json({
      status: 'success',
      data: {
        Product
      }
    });
  }),

  deleteProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const Product = await ProductRepository.findOne({
      where: { id: parseInt(productId, 10) }
    });
    if (!Product) {
      return next(new AppError('Product not found', 404));
    }
    const deleteResponse = await fetch(Product.deleteURL, {
      method: 'GET'
    });
    if (!deleteResponse.ok) {
      return next(new AppError('Image not deleted', 404));
    }
    const deletedProduct = await ProductRepository.delete({ id: parseInt(productId, 10) });
    if (!deletedProduct) {
      return next(new AppError('Product not deleted', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: null
    });
  }),
}


export default productController;