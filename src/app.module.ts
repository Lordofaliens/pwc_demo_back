import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {GatewayController} from "./gateway/gateway.controller";
import {PVAController} from "./pva/pva.controller";
import {CustomerModule} from "./database/customer/customer.module";
import {OrderModule} from "./database/order/order.module";
import {ProductModule} from "./database/product/product.module";
import {PVAModule} from "./pva/pva.module";
import {GatewayModule} from "./gateway/gateway.module";
import { GatewayService } from './gateway/gateway.service';
import { SchemaCreatorService } from './schema-creator/schema-creator.service';
@Module({
  imports: [CustomerModule, OrderModule, ProductModule, GatewayModule, PVAModule],
  controllers: [AppController, GatewayController, PVAController],
  providers: [AppService, GatewayService, SchemaCreatorService],
})
export class AppModule {}
