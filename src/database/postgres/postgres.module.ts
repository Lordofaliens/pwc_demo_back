import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { PostgresService } from './postgres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';



@Module({
    imports: [
      TypeOrmModule.forFeature([Customer, Product, Order]),
      CustomerModule,
      ProductModule,
      OrderModule
    ],
    providers: [PostgresService],
    exports: [PostgresService],
  })
  export class PostgresModule {}