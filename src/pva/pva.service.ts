import { Injectable } from '@nestjs/common';
import { OrderService } from '../database/order/order.service';
import { ProductService } from '../database/product/product.service';

@Injectable()
export class PVAService {
    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {}

    async calculatePVA(pvaConfig: any) {
        const customerIDs = pvaConfig?.customerIDs || [];
        const productIDs = pvaConfig?.productIDs || [];

        // Fetch data from the respective services
        const orders = await this.orderService.getOrders(customerIDs, productIDs);
        console.log("ORDER LENGTH", orders.length);
        const products = await this.productService.getAllProducts();
        console.log("PRODUCT LENGTH", products.length);
        let firstYearProjection: number = 0;
        let totalQuantity: number = 0;
        let totalPriceImpact: number = 0;
        let totalVolumeImpact: number = 0;
        let totalMixImpact: number = 0;

        // Parse data to calculate total weighted price and total quantity
        orders.forEach(order => {
            const product = products.find(p => p.product_key === order.product_id);
            if (product) {
                for (let i = 0; i < order.quantity; i++) {
                    firstYearProjection += Number(product.unit_price);
                }
                totalQuantity += order.quantity;
            }
        });

        const weightedAveragePrice: number = totalQuantity > 0 ? (firstYearProjection / totalQuantity) : 0.00;

        // Calculate PVA for each order
        const results = orders.map(order => {
            const product = products.find(p => p.product_key === order.product_id);
            if (!product) return null;

            const currentPrice = product.unit_price;
            const previousPrice = currentPrice * this.getRandomMultiplier();
            const quantity = order.quantity;
            const previousQuantity = quantity * this.getRandomMultiplier();
            const currentQuantityPercent = quantity / totalQuantity;
            const previousQuantityPercent = currentQuantityPercent * this.getRandomMultiplier();

            const priceImpact = (currentPrice - previousPrice) * quantity;
            const mixImpact = quantity * (previousPrice - weightedAveragePrice) * (currentQuantityPercent - previousQuantityPercent);
            const volumeImpact = (quantity - previousQuantity) * previousPrice - mixImpact;

            totalPriceImpact += priceImpact;
            totalVolumeImpact += volumeImpact;
            totalMixImpact += mixImpact;

            return {
                orderID: order.index,
                quantity,
                previousQuantity,
                previousPrice,
                currentPrice,
                priceImpact,
                volumeImpact,
                mixImpact,
            };
        }).filter(result => result !== null);

        let secondYearProjection: number = Number(firstYearProjection) + Number(totalPriceImpact) + Number(totalVolumeImpact) + Number(totalMixImpact);

        console.log('Total Quantity:', totalQuantity);
        console.log('First Year Projection:', firstYearProjection);
        console.log('Total Price Impact:', totalPriceImpact);
        console.log('Total Volume Impact:', totalVolumeImpact);
        console.log('Total Mix Impact:', totalMixImpact);
        console.log('Second Year Projection:', secondYearProjection);

        return { results, totalQuantity, firstYearProjection, totalPriceImpact, totalVolumeImpact, totalMixImpact, secondYearProjection };
    }

    private getRandomMultiplier(): number {
        let rand1 = Math.random();
        let rand2 = Math.random();

        // Generate a random number with Gaussian distribution (mean = 1, stddev ~0.1)
        let gaussianRandom = Math.sqrt(-2.0 * Math.log(rand1)) * Math.cos(2.0 * Math.PI * rand2);

        // Scale it to fit in the range [0.85, 1.15]
        let scaledRandom = 1 + gaussianRandom * 0.2; // Adjust std deviation to fit range

        // Ensure it's within bounds
        return Math.min(Math.max(scaledRandom, 0.7), 1.3);
    }
}
