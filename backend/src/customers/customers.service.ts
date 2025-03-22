import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from '../auth/schemas/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, companyId: string): Promise<Customer> {
    // Try to find existing user by email or document
    let user = await this.userModel.findOne({
      $or: [
        { email: createCustomerDto.email },
        { document: createCustomerDto.document },
      ],
    });

    // If user doesn't exist, create a new one
    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Generate random password
      const { user: newUser } = await this.authService.register({
        email: createCustomerDto.email,
        password,
        name: createCustomerDto.name,
        document: createCustomerDto.document,
      });
      user = await this.userModel.findById(newUser.id);
      
      if (!user) {
        throw new Error('Failed to create user');
      }
    }

    // Create customer
    const customer = new this.customerModel({
      userId: new Types.ObjectId(user.id),
      companyId: new Types.ObjectId(companyId),
      code: createCustomerDto.code,
      name: createCustomerDto.name,
      phone: createCustomerDto.phone,
      address: createCustomerDto.address,
    });

    return customer.save();
  }

  async findAll(companyId: string): Promise<Customer[]> {
    return this.customerModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate('userId', 'email name document')
      .exec();
  }

  async findOne(id: string, companyId: string): Promise<Customer> {
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

  async findByCode(code: string, companyId: string): Promise<Customer | null> {
    return this.customerModel
      .findOne({
        code,
        companyId: new Types.ObjectId(companyId),
      })
      .populate('userId', 'email name document')
      .exec();
  }

  async update(
    id: string,
    updateCustomerDto: Partial<CreateCustomerDto>,
    companyId: string,
  ): Promise<Customer> {
    const customer = await this.customerModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          companyId: new Types.ObjectId(companyId),
        },
        { $set: updateCustomerDto },
        { new: true },
      )
      .populate('userId', 'email name document');

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async remove(id: string, companyId: string): Promise<void> {
    const result = await this.customerModel.deleteOne({
      _id: new Types.ObjectId(id),
      companyId: new Types.ObjectId(companyId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Customer not found');
    }
  }
}
