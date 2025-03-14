import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Product } from '../product/product.entity';

@Entity('fact_table')
export class Order {
    @PrimaryGeneratedColumn()
    index: number;

    @Column()
    invoice_no: string;
  
    @Column()
    quantity: number;
  
    @Column()
    invoice_date: Date;
  
    @Column()
    customer_id: number;
  
    @Column()
    product_id: number;
    
    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Product, product => product.orders)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
