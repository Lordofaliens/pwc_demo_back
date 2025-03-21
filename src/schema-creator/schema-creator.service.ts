import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import csvParser from 'csv-parser';
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');


async function schemaInConversation(prompt: string, csvData:string) {
  console.log("schemaInConversation");
  // Here we will be talking with gemini to create start schema using prompts
  const promptExt = `
        Given the following transactional data in CSV format, suggest a star schema with a fact table. The data is provided below:
        
        **Note that this is actually a conversation with the user**

        ${csvData}
        **Requirements:**
        1. **Fact Table**: Create a fact table, based on the data provided.

        2. **Dimension Tables**: Make maximum 4 dimensions tables

        3. Latest prompts from the user:
          ${prompt}

        **Output Format**:
          - Provide only a simple list with indents for the keys in each table, keep it simple and neat
          - Do not include any other information, just the keys and tables
          - Make sure to have the most uptodate information in the schema, this is a conversation with the user
      `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(promptExt);
  console.log(result.response.text());
  return result.response.text();
}

async function generateStarSchemaWithGemini(csvData: string) {
    const prompt = `Given the following transactional data in CSV format, suggest a star schema with a fact table and two dimension tables. The data is provided below:

      ${csvData}

      **Requirements:**
      1. **Fact Table**: Must include the following columns:
         - CustomerID (Foreign Key referencing Customer_Dim)
         - ProductID (Foreign Key referencing Product_Dim)
         - Index (Preserved unique ID for the transaction)
         - InvoiceNo (Invoice number for the transaction)
         - Quantity (Quantity of the product sold)

      2. **Dimension Tables**: Only TWO dimensions are allowed:
         - **Product_Dim**: Must include the following attributes:
           - ProductID (Primary Key, unique identifier for the product)
           - StockCode (Product code)
           - UnitPrice (Price per unit of the product)
         - **Customer_Dim**: Must include the following attributes:
           - CustomerID (Primary Key, unique identifier for the customer)
           - Country (Country of the customer)

      3. **Important Notes**:
         - Include Invoice Data in fact table.
         - DO NOT include a Time dimension. I repeat, DO NOT add a Time dimension.
         - Ensure the schema adheres strictly to the requirements above. Only two dimensions (Product_Dim and Customer_Dim) should be created.

      **Output Format**:
      Please provide the schema in the following format:
      - Fact Table: [fact table columns]
      - Dimension Tables: [dimension table columns]
      `;
  
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Corrected model initialization
    const result = await model.generateContent(prompt);
    return result.response.text(); // Correct response handling
}


@Injectable()
export class SchemaCreatorService {



  async processData(rows: any, data: any) {
    if (!rows.length) {
      throw new BadRequestException('No data found in CSV');
    }
    const schema = await generateStarSchemaWithGemini(data); 
    return {
        message: 'Star Schema Suggested',
        schema,
        sampleData: rows.slice(0, 5),
    };
  }


  async geminiConservation(prompt: string, rows: any, data: any) {
    if (!rows.length) {
      throw new BadRequestException('No data found in CSV');
    }    
    if(!data) {
      throw new Error('No data provided');
    }
    const schema = await schemaInConversation(prompt, data);

    console.log("here");
    return {schema}
  }

}