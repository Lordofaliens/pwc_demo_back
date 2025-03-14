import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('product_dim')
export class Product {
  @PrimaryGeneratedColumn()
  product_key: number;

  @Column()
  stock_code: string;

  @Column('text')
  description: string;

  @Column('numeric')
  unit_price: number;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];
}

