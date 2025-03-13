import { Controller, Post, Body } from '@nestjs/common';
import { PVAService } from './pva.service';

@Controller('pva')
export class PVAController {
    constructor(private readonly pvaService: PVAService) {}

    @Post('analyze')
    async analyze(@Body() pvaConfig: any) {
        return this.pvaService.calculatePVA(pvaConfig);
    }
}
