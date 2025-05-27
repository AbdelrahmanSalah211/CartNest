import crypto from 'crypto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import argon2 from 'argon2';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  InsertEvent,
} from 'typeorm';
import Order from './orderModel';

enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer"
}

enum UserGender {
  Male = "male",
  FEMALE = 'female'
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  photo: string;

  @Column()
  deleteURL: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @Column({
    type: "enum",
    enum: UserGender,
  })
  gender: UserGender;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  async beforeInsertLowercase() {
    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
  }

  static async correctPassword(userPassword: string, candidatePassword: string): Promise<boolean> {
    return argon2.verify(userPassword, candidatePassword);
  }

  createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }
}

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await argon2.hash(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const newPassword = event.entity?.password;
    const oldPassword = event.databaseEntity?.password;

    if (newPassword && newPassword !== oldPassword) {
      event.entity.password = await argon2.hash(newPassword);
    }
  }
}

export default User;