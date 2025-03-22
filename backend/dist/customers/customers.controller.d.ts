import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from '../auth/schemas/user.schema';
import { CompaniesService } from '../companies/companies.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly companiesService;
    constructor(customersService: CustomersService, companiesService: CompaniesService);
    create(createCustomerDto: CreateCustomerDto, user: User): Promise<import("./schemas/customer.schema").Customer>;
    findAll(user: User): Promise<import("./schemas/customer.schema").Customer[]>;
    findOne(id: string, user: User): Promise<import("./schemas/customer.schema").Customer>;
    update(id: string, updateCustomerDto: Partial<CreateCustomerDto>, user: User): Promise<import("./schemas/customer.schema").Customer>;
    remove(id: string, user: User): Promise<void>;
}
