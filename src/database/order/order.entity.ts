import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    CustomerID: number;

    @Column()
    ProductID: number;

    @Column()
    Quantity: number;

    @Column()
    Invoice_Num: number;
}
