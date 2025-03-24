import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersService } from '../users/users.service';
export declare class CustomersService {
    private customerModel;
    private usersService;
    constructor(customerModel: Model<CustomerDocument>, usersService: UsersService);
    private generateCustomerCode;
    private ensureUniqueCode;
    create(companyId: string, createCustomerDto: CreateCustomerDto): Promise<import("mongoose").Document<unknown, {}, CustomerDocument> & Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(companyId: string): Promise<(import("mongoose").Document<unknown, {}, CustomerDocument> & Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(companyId: string, id: string): Promise<import("mongoose").Document<unknown, {}, CustomerDocument> & Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(companyId: string, id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<import("mongoose").Document<unknown, {}, CustomerDocument> & Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(companyId: string, id: string): Promise<{
        id: string;
    }>;
}
