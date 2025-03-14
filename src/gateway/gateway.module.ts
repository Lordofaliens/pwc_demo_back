import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import { PostgresModule } from 'src/database/postgres/postgres.module';

@Module({
    imports: [PostgresModule],
    controllers: [GatewayController],
    providers: [GatewayService, SchemaCreatorService],
})
export class GatewayModule {}
