import { Document, Types } from 'mongoose';
export type CompanyDocument = Company & Document;
export declare class Company {
    _id: Types.ObjectId;
    id: string;
    name: string;
    description: string;
    document: string;
    address: string;
    userId: Types.ObjectId;
}
export declare const CompanySchema: import("mongoose").Schema<Company, import("mongoose").Model<Company, any, any, any, Document<unknown, any, Company> & Company & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Company, Document<unknown, {}, import("mongoose").FlatRecord<Company>> & import("mongoose").FlatRecord<Company> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
