import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { PostgresService } from './postgres.service';



@Module({
    imports: [CustomerModule],
    controllers: [],
    providers: [PostgresService],
    exports: [PostgresService],
})
export class PostgresModule {}