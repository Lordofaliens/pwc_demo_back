import { Controller, Post, UploadedFile, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { Express } from 'express';

@Controller('gateway')
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}

    @Post('generate-schema')
    @UseInterceptors(FileInterceptor('file'))
    async generateSchema(
    @UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        if (!prompt) {
            throw new BadRequestException('No prompt provided');
        }

        console.log('Received file:', file.originalname);
        console.log('Received prompt:', prompt);
        
        return this.gatewayService.communitcateWithGemini(prompt, file);
    }


    @Post('schema-gemini')
    @UseInterceptors(FileInterceptor('file'))
    async schemaGemini(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file provided');
        }
        console.log(file.originalname);

        return await this.gatewayService.processFile(file);
    }

    @Post('calculate-pva')
    @UseInterceptors(FileInterceptor('file'))
    async calculatePva(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        console.log("Received file:", file.originalname);

        // Process the file
        const schema = (await this.gatewayService.processFile(file)).schema.schema;
        return await this.gatewayService.calculatePva(schema);
    }
}
