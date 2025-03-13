import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    Unit_Price: number;

    @Column()
    Stock_Code: string;
}
