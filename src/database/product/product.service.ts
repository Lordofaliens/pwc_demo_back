import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async getProductById(id: number): Promise<Product> {
        return this.productRepository.findOne({ where: { ID: id } });
    }

    async createProduct(product: Partial<Product>): Promise<Product> {
        return this.productRepository.save(product);
    }
}
