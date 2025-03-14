import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { Connection } from 'typeorm';

@Injectable()
export class PostgresService {
  constructor(
    private connection: Connection,
  ) {}

  async createSchema() {
    await this.connection.synchronize();
  }
}
