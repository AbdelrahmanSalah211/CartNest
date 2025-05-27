import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import Order from "./orderModel";
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity("products")
class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  deleteURL: string;

  @Column()
  createdAt: Date;

  @Column()
  user: number;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}

export default Product;