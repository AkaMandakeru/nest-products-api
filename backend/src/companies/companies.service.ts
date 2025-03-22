import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string): Promise<Company> {
    // Check if user already has a company
    const existingCompany = await this.companyModel.findOne({ userId: new Types.ObjectId(userId) });
    if (existingCompany) {
      throw new ForbiddenException('User already has a company');
    }

    const company = new this.companyModel({
      ...createCompanyDto,
      userId: new Types.ObjectId(userId),
    });
    return company.save();
  }

  async findByUserId(userId: string): Promise<Company> {
    const company = await this.companyModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(userId: string, updateCompanyDto: Partial<CreateCompanyDto>): Promise<Company> {
    const company = await this.companyModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: updateCompanyDto },
      { new: true },
    );

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async hasCompany(userId: string): Promise<boolean> {
    const company = await this.companyModel.findOne({ userId: new Types.ObjectId(userId) });
    return !!company;
  }
}
