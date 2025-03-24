import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private usersService: UsersService,
  ) {}

  private generateCustomerCode(): string {
    // Generate a 6-character hex code (similar to SecureRandom.hex(3) in Ruby)
    return randomBytes(3).toString('hex').toUpperCase();
  }

  private async ensureUniqueCode(companyId: string): Promise<string> {
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = this.generateCustomerCode();
      const existingCustomer = await this.customerModel.findOne({
        companyId: new Types.ObjectId(companyId),
        code,
      });
      if (!existingCustomer) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique customer code');
    }

    return code!;
  }

  async create(companyId: string, createCustomerDto: CreateCustomerDto) {
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }

    // Generate a unique code for the customer
    const code = await this.ensureUniqueCode(companyId);

    // Create or get user
    const user = await this.usersService.findOrCreate({
      email: createCustomerDto.email,
      document: createCustomerDto.document,
      name: createCustomerDto.name,
    });

    // Create customer
    const customer = new this.customerModel({
      userId: user._id,
      companyId: new Types.ObjectId(companyId),
      code,
      name: createCustomerDto.name,
      phone: createCustomerDto.phone,
      address: createCustomerDto.address,
      isActive: true,
    });

    return customer.save();
  }

  async findAll(companyId: string) {
    if (!companyId) {
      return []; // Return empty list if user has no company
    }
    
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }
    
    return this.customerModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate('userId', 'email name document')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(companyId: string, id: string) {
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }

    const customer = await this.customerModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .populate('userId', 'email name document')
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(companyId: string, id: string, updateCustomerDto: Partial<CreateCustomerDto>) {
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }

    const customer = await this.customerModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Update user information if provided
    if (updateCustomerDto.email || updateCustomerDto.name || updateCustomerDto.document) {
      await this.usersService.update(customer.userId.toString(), {
        email: updateCustomerDto.email,
        name: updateCustomerDto.name,
        document: updateCustomerDto.document,
      });
    }

    // Update customer fields
    Object.assign(customer, {
      name: updateCustomerDto.name,
      phone: updateCustomerDto.phone,
      address: updateCustomerDto.address,
    });

    return customer.save();
  }

  async remove(companyId: string, id: string) {
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }

    const customer = await this.customerModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await customer.deleteOne();
    return { id };
  }
}
