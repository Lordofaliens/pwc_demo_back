import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await this.client.connect();
  }

  async createSchema() {
    const schema = `
      CREATE TABLE IF NOT EXISTS Product_Dim (
        ProductID SERIAL PRIMARY KEY,
        StockCode TEXT,
        Description TEXT,
        UnitPrice NUMERIC
      );

      CREATE TABLE IF NOT EXISTS Customer_Dim (
        CustomerID SERIAL PRIMARY KEY,
        Country TEXT
      );

      CREATE TABLE IF NOT EXISTS Fact_Table (
        InvoiceNo TEXT,
        Index SERIAL PRIMARY KEY,
        CustomerID INT REFERENCES Customer_Dim(CustomerID),
        ProductID INT REFERENCES Product_Dim(ProductID),
        Quantity INT,
        InvoiceDate TIMESTAMP
      );
    `;
    await this.client.query(schema);
  }

  async disconnect() {
    await this.client.end();
  }
}
