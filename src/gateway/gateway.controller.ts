import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { Express } from 'express';

@Controller('gateway')
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) // Handles single file uploads
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        return this.gatewayService.processFile(file);
    }
}
