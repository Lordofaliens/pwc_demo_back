import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { Express } from 'express';


@Controller('gateway')
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}

    @Post('uploadPath')
    async uploadPath(@Body() body: { filePath: string }) {
        const { filePath } = body;
        
        if (!filePath) {
            throw new Error('No file path provided');
        }
        console.log(filePath);
        return this.gatewayService.processFile(filePath);
    }
    
}
