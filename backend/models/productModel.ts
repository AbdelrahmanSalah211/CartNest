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
  details: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  deleteURL: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}

export default Product;