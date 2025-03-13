import { Injectable } from '@nestjs/common';
//import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class GatewayService {
    constructor(
        //TODO: private readonly schemaCreatorService: SchemaCreatorService
        ) {}

    async processFile(file: Express.Multer.File) {
        const results = [];

        return new Promise((resolve, reject) => {
            const stream = Readable.from(file.buffer.toString());

            stream
                .pipe(csvParser())
                .on('data', (data) => results.push(data)) // Collect parsed CSV data
                .on('end', async () => {
                    try {
                        //TODO: const response = await this.schemaCreatorService.processData(results);
                        // resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }
}
