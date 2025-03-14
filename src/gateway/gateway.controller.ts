import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { Express } from 'express';

@Controller('gateway')
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}

    @Post('generate-schema')
    async generateSchema(@Body() body: { filePath: string }) {
        const { filePath } = body;
        
        if (!filePath) {
            throw new Error('No file path provided');
        }
        console.log(filePath);

        return await this.gatewayService.processFile(filePath);
    }

    @Post('calculate-pva')
    async calculatePva(@Body() body: { filePath: string }) {
        const {filePath} = body;

        if (!filePath) {
            throw new Error('No file path provided');
        }
        console.log(filePath);

        const schema = (await this.gatewayService.processFile(filePath)).schema.schema;
        return await this.gatewayService.calculatePva(schema);
    }
}
