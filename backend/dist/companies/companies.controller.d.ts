import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../auth/schemas/user.schema';
import { Company } from './schemas/company.schema';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto, user: User): Promise<Company>;
    findOne(user: User): Promise<Company>;
    update(updateCompanyDto: CreateCompanyDto, user: User): Promise<Company>;
    hasCompany(user: User): Promise<{
        hasCompany: boolean;
        company: Company | null;
    }>;
}
