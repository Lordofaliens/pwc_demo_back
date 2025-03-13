import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayController } from './gateway/gateway.controller';
import { GatewayService } from './gateway/gateway.service';
import { SchemaCreatorService } from './schema-creator/schema-creator.service';

@Module({
  imports: [],
  controllers: [AppController, GatewayController],
  providers: [AppService, GatewayService, SchemaCreatorService],
})
export class AppModule {}
