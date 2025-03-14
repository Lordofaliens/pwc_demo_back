import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) {}

    async getAllCustomers(): Promise<Customer[]> {
        return this.customerRepository.find();
    }

    async getCustomerById(id: number): Promise<Customer> {
        return this.customerRepository.findOne({ where: { customer_key: id } });
    }
    
    async getCustomerByExternalId(customerId: string) {
        return this.customerRepository.findOne({
          where: { customerId },
        });
      }

    async createCustomer(customer: Partial<Customer>): Promise<Customer> {
        return this.customerRepository.save(customer);
    }
}
