import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from '../auth/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
export declare class CustomersService {
    private customerModel;
    private userModel;
    private authService;
    constructor(customerModel: Model<CustomerDocument>, userModel: Model<User>, authService: AuthService);
    create(createCustomerDto: CreateCustomerDto, companyId: string): Promise<Customer>;
    findAll(companyId: string): Promise<Customer[]>;
    findOne(id: string, companyId: string): Promise<Customer>;
    findByCode(code: string, companyId: string): Promise<Customer | null>;
    update(id: string, updateCustomerDto: Partial<CreateCustomerDto>, companyId: string): Promise<Customer>;
    remove(id: string, companyId: string): Promise<void>;
}
