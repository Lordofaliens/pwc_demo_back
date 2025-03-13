import { Module } from '@nestjs/common';
import { PVAService } from './pva.service';
import { PVAController } from './pva.controller';

@Module({
    controllers: [PVAController],
    providers: [PVAService],
    exports: [PVAService], // Allows other modules to use this service
})
export class PVAModule {}
