import { Module } from '@nestjs/common';
import { PVAService } from './pva.service';
import { PVAController } from './pva.controller';
import {CustomerModule} from "../database/customer/customer.module";
import {OrderModule} from "../database/order/order.module";
import {ProductModule} from "../database/product/product.module";

@Module({
    imports: [CustomerModule, OrderModule, ProductModule],
    controllers: [PVAController],
    providers: [PVAService],
    exports: [PVAService],
})
export class PVAModule {}
