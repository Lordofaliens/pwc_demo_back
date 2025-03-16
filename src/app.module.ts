// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GatewayModule } from './gateway/gateway.module';
import { CustomerModule } from './database/customer/customer.module';
import { OrderModule } from './database/order/order.module';
import { ProductModule } from './database/product/product.module';
import { PVAModule } from './pva/pva.module';
import { PostgresModule } from './database/postgres/postgres.module';

//log the password before the .forRoot() call
// This works: console.log(process.env.DB_PASSWORD);

// Add your environment variables or replace with your connection details.
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Satyam', // Ensure this is correct
      database: 'pwc_demo',
      schema: 'public',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GatewayModule,
    CustomerModule,
    OrderModule,
    ProductModule,
    PVAModule,
    PostgresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
