import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import { PostgresModule } from 'src/database/postgres/postgres.module';
import { CustomerService } from 'src/database/customer/customer.service';
import { ProductModule} from 'src/database/product/product.module';
import { CustomerModule } from 'src/database/customer/customer.module';
import { OrderModule } from 'src/database/order/order.module';
@Module({
    imports: [PostgresModule, CustomerModule, ProductModule, OrderModule],
    controllers: [GatewayController],
    providers: [GatewayService, SchemaCreatorService],
  })
export class GatewayModule {}
