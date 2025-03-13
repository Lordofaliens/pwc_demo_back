import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
// import { SchemaCreatorModule } from '../schema-creator/schema-creator.module';

@Module({
    imports: [],
    //TODO: imports: [SchemaCreatorModule], // Import SchemaCreatorModule
    controllers: [GatewayController],
    providers: [GatewayService],
})
export class GatewayModule {}
