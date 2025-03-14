import { Injectable, Logger } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { SchemaCreatorService } from '../schema-creator/schema-creator.service';
import { PostgresService } from 'src/database/postgres/postgres.service';
import { CustomerService } from '../database/customer/customer.service';
import { ProductService } from '../database/product/product.service';
import { OrderService } from '../database/order/order.service';
const fs = require('fs');

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);
    
    constructor(
        private readonly schemaCreatorService: SchemaCreatorService,
        private readonly postgresService: PostgresService,
        private readonly customerService: CustomerService,
        private readonly productService: ProductService,
        private readonly orderService: OrderService
    ) {}

    async processFile(filePath: string) {
        const processedData = {
            customers: 0,
            products: 0,
            orders: 0,
            errors: 0,
        };

        const rows: any[] = [];
        
        try {
            await new Promise<void>((resolve, reject) => {
                fs.createReadStream(filePath)
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
                    console.log(`Processed row ${index + 1} of ${rows.length}`);
                    console.log(`Processed data: ${JSON.stringify(processedData)}`);

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
}