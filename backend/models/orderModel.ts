import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import User from "./userModel";
import Product from "./productModel";
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum OrderStatus {
  APPROVED = "approved",
  PENDING = "pending",
  DELIVERED = "delivered",
}

@Entity("orders")
class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ default: new Date(Date.now()) })
  orderDate: Date;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable({
    name: "orders_products"
  })
  products: Product[];
}

export default Order;