import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parse } from 'csv-parse';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create(createProductDto);
    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async createManyFromCsv(fileBuffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
      const products: CreateProductDto[] = [];
      const parser = parse({
        delimiter: ',',
        columns: true,
        skip_empty_lines: true,
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          const product: CreateProductDto = {
            name: record.name,
            description: record.description,
            price: parseFloat(record.price),
            quantity: parseInt(record.quantity, 10),
          };
          products.push(product);
        }
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', async () => {
        try {
          const result = await this.productModel.insertMany(products);
          resolve(result.length);
        } catch (error) {
          reject(error);
        }
      });

      parser.write(fileBuffer);
      parser.end();
    });
  }
}
