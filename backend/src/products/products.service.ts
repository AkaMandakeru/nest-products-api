import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import * as csv from 'csv-parse';
import { Express } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string, companyId: string): Promise<Product> {
    const product = new this.productModel({
      ...createProductDto,
      userId: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(companyId),
    });
    return product.save();
  }

  async findAll(userId: string, query: ListProductsDto): Promise<{ data: Product[]; total: number; pages: number }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter: any = { userId: new Types.ObjectId(userId) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);

    return { data, total, pages };
  }

  async findOne(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product> {
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      { $set: updateProductDto },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async processUploadedFile(file: Express.Multer.File, userId: string, companyId: string): Promise<{ created: number }> {
    const createdCount = await this.createManyFromCsv(file.buffer, userId, companyId);
    return { created: createdCount };
  }

  private async createManyFromCsv(fileBuffer: Buffer, userId: string, companyId: string): Promise<number> {
    const records: any[] = [];
    const parser = csv.parse({
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
    });

    const parsePromise = new Promise<void>((resolve, reject) => {
      parser.on('readable', function() {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });
      parser.on('error', reject);
      parser.on('end', resolve);
    });

    parser.write(fileBuffer);
    parser.end();

    await parsePromise;

    const products = records.map((record) => ({
      name: record.name,
      description: record.description,
      price: parseFloat(record.price),
      quantity: parseInt(record.quantity, 10) || 0,
      userId: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(companyId),
    }));

    const result = await this.productModel.insertMany(products);
    return result.length;
  }
}
