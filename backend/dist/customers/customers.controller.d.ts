import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CompaniesService } from '../companies/companies.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly companiesService;
    constructor(customersService: CustomersService, companiesService: CompaniesService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").CustomerDocument> & import("./schemas/customer.schema").Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").CustomerDocument> & import("./schemas/customer.schema").Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").CustomerDocument> & import("./schemas/customer.schema").Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(req: any, id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").CustomerDocument> & import("./schemas/customer.schema").Customer & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
    }>;
}
