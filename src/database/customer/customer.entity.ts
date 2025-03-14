import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('customer_dim')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_key: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column()
  country: string;
  
  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}