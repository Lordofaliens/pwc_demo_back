import { Injectable, Logger } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import { PostgresService } from 'src/database/postgres/postgres.service';
import { CustomerService } from '../database/customer/customer.service';
import { ProductService } from '../database/product/product.service';
import { OrderService } from '../database/order/order.service';
import {PVAService} from "../pva/pva.service";
const fs = require('fs');

import { Readable } from 'stream';

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);
    
    constructor(
        private readonly schemaCreatorService: SchemaCreatorService,
        private readonly postgresService: PostgresService,
        private readonly customerService: CustomerService,
        private readonly productService: ProductService,
        private readonly orderService: OrderService,
        private readonly pvaService: PVAService,
    ) {}


    async communitcateWithGemini(prompt : string, file: Express.Multer.File) {
        const rows: any[] = [];
        if (!file) {
            throw new Error('No file provided');
        }
        try{
            const readableStream = Readable.from(file.buffer);
            await new Promise<void>((resolve, reject) => {
                readableStream
                    .pipe(csvParser())
                    .on('data', (row) => rows.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });
            const csvData = rows.slice(0, 10)
                .map((row) => Object.values(row).join(','))
                .join('\n');

            const schema = await this.schemaCreatorService.geminiConservation(prompt, rows, csvData);
            return {success: true, schema};
        }
        catch (error) {
            this.logger.error(`File processing failed: ${error.message}`);
            throw error;
        }

    }
    async processFile(file: Express.Multer.File) {
        const processedData = {
            customers: 0,
            products: 0,
            orders: 0,
            errors: 0,
        };

        const rows: any[] = [];

        try {
            // Convert file.buffer into a readable stream
            const readableStream = Readable.from(file.buffer);

            await new Promise<void>((resolve, reject) => {
                readableStream
                    .pipe(csvParser())
                    .on('data', (row) => rows.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });

            const csvData = rows.slice(0, 10)
                .map((row) => Object.values(row).join(','))
                .join('\n');

            const schema = await this.schemaCreatorService.processData(rows, csvData);

            // Create database schema
            await this.postgresService.createSchema();

            // Process each row
            for (const [index, row] of rows.entries()) {
                try {
                    // Process Customer
                    let customer = await this.customerService.getCustomerByExternalId(row.CustomerID);
                    if (!customer) {
                        customer = await this.customerService.createCustomer({
                            customerId: row.CustomerID,
                            country: row.Country,
                        });
                        processedData.customers++;
                    }

                    // Process Product
                    let product = await this.productService.getProductByStockCode(row.StockCode);
                    if (!product) {
                        product = await this.productService.createProduct({
                            stock_code: row.StockCode,
                            description: row.Description,
                            unit_price: parseFloat(row.UnitPrice),
                        });
                        processedData.products++;
                    }

                    // Create Order
                    await this.orderService.createOrder({
                        invoice_no: row.InvoiceNo.toString(),
                        quantity: parseInt(row.Quantity),
                        invoice_date: new Date(row.InvoiceDate),
                        customer_id: customer.customer_key,
                        product_id: product.product_key,
                    });
                    processedData.orders++;

                } catch (error) {
                    processedData.errors++;
                    this.logger.error(`Error processing row ${index}: ${error.message}`);
                }
            }

            return {
                message: 'Data loading completed',
                schema,
                processedData
            };

        } catch (error) {
            this.logger.error(`File processing failed: ${error.message}`);
            throw error;
        }
    }

    async calculatePva(schema: string) {
        const {firstYearProjection, totalPriceImpact, totalVolumeImpact, totalMixImpact, secondYearProjection} = await this.pvaService.calculatePVA(schema);
        return {success: true, firstYearProjection, totalPriceImpact, totalVolumeImpact, totalMixImpact, secondYearProjection};
    }
}