import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    async getOrderById(id: number): Promise<Order> {
        return this.orderRepository.findOne({ where: { ID: id } });
    }

    async createOrder(order: Partial<Order>): Promise<Order> {
        return this.orderRepository.save(order);
    }
}
