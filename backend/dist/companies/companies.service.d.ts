import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
export declare class CompaniesService {
    private companyModel;
    constructor(companyModel: Model<CompanyDocument>);
    create(createCompanyDto: CreateCompanyDto, userId: string): Promise<Company>;
    findByUserId(userId: string): Promise<Company>;
    update(userId: string, updateCompanyDto: Partial<CreateCompanyDto>): Promise<Company>;
    hasCompany(userId: string): Promise<boolean>;
}
