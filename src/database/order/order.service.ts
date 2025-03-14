import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async getOrdersByCustomerAndProduct(customerIDs: number[], productIDs: number[]): Promise<Order[]> {
        return this.orderRepository.find({
            where: {
                customer: In(customerIDs),
                product: In(productIDs),
            },
        });
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    async createOrder(order: Partial<Order>): Promise<Order> {
        return this.orderRepository.save(order);
    }

    async getOrders(customerIDs?: number[], productIDs?: number[]) {
        const query = this.orderRepository.createQueryBuilder('order');

        // If customerIDs array is not empty, apply the filter
        if (customerIDs?.length) {
            query.andWhere('order.customer_id IN (:...customerIDs)', { customerIDs });
        }

        // If productIDs array is not empty, apply the filter
        if (productIDs?.length) {
            query.andWhere('order.product_id IN (:...productIDs)', { productIDs });
        }

        return query.getMany();
    }

}
