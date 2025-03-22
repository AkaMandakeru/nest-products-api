import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../auth/schemas/user.schema';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto, user: User): Promise<import("./schemas/company.schema").Company>;
    findOne(user: User): Promise<import("./schemas/company.schema").Company>;
    update(updateCompanyDto: CreateCompanyDto, user: User): Promise<import("./schemas/company.schema").Company>;
    hasCompany(user: User): Promise<{
        hasCompany: boolean;
    }>;
}
