import { Injectable } from '@nestjs/common';
import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { PostgresService } from 'src/database/postgres/postgres.service';
const fs = require('fs');


@Injectable()
export class GatewayService {
    constructor(
        private readonly schemaCreatorService: SchemaCreatorService, 
        private readonly postgresService: PostgresService
        ) {}

    async processFile(filePath: string) {
        const rows: any[] = [];
        const fileLoc = "data/transaction_data.csv";
        console.log("1")
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(fileLoc)
              .pipe(csvParser())
              .on('data', (row) => rows.push(row))
              .on('end', resolve)
              .on('error', reject);
          });
        
        console.log("2")
        const csvData = rows.slice(0, 10).map((row) => Object.values(row).join(',')).join('\n');
        const schema = await this.schemaCreatorService.processData(rows, csvData);
          
        // make a postgress connection and create the schema
        await this.postgresService.createSchema();
        return schema
    }
}
