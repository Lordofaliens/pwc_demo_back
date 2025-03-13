import { Injectable } from '@nestjs/common';

@Injectable()
export class PVAService {
    async calculatePVA(starSchemaBlueprint: any) {
        const { customerIDs, productIDs } = starSchemaBlueprint;

        // Sample Data (Fact Table)
        const factTable = [
            { ID: 1, CustomerID: 101, ProductID: 1, Quantity: 10, Invoice_Num: 1001 },
            { ID: 2, CustomerID: 102, ProductID: 2, Quantity: 5, Invoice_Num: 1002 },
            { ID: 3, CustomerID: 101, ProductID: 1, Quantity: 15, Invoice_Num: 1003 },
            { ID: 4, CustomerID: 103, ProductID: 3, Quantity: 20, Invoice_Num: 1004 },
        ];

        // Sample Data (Product Dim)
        const productDim = [
            { ID: 1, Unit_Price: 20, Stock_Code: 'P100' },
            { ID: 2, Unit_Price: 50, Stock_Code: 'P200' },
            { ID: 3, Unit_Price: 30, Stock_Code: 'P300' },
        ];

        // Sample Data (Customer Dim)
        const customerDim = [
            { ID: 101, Country: 'USA' },
            { ID: 102, Country: 'UK' },
            { ID: 103, Country: 'Germany' },
        ];

        // Filter Fact Table based on input IDs
        const filteredData = factTable.filter(
            (row) => customerIDs.includes(row.CustomerID) && productIDs.includes(row.ProductID),
        );

        // Calculate PVA Metrics
        let previousValue = 0;
        let currentValue = 0;
        let priceImpact = 0;
        let volumeImpact = 0;
        let mixImpact = 0;

        filteredData.forEach((row) => {
            const product = productDim.find((p) => p.ID === row.ProductID);
            if (!product) return;

            const unitPrice = product.Unit_Price;
            const quantity = row.Quantity;

            previousValue += unitPrice * (quantity - 2); // Simulating previous quantity
            currentValue += unitPrice * quantity;
        });

        priceImpact = currentValue - previousValue;
        volumeImpact = (currentValue / previousValue - 1) * 100;
        mixImpact = priceImpact - volumeImpact;

        return {
            previousValue: previousValue.toFixed(2),
            currentValue: currentValue.toFixed(2),
            priceImpact: priceImpact.toFixed(2),
            volumeImpact: volumeImpact.toFixed(2),
            mixImpact: mixImpact.toFixed(2),
        };
    }
}
