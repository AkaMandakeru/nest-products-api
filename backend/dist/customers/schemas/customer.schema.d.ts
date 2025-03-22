import { Document, Types } from 'mongoose';
export type CustomerDocument = Customer & Document;
export declare class Customer {
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
    code: string;
    name: string;
    phone?: string;
    address?: string;
    isActive: boolean;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, Document<unknown, any, Customer> & Customer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, import("mongoose").FlatRecord<Customer>> & import("mongoose").FlatRecord<Customer> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
