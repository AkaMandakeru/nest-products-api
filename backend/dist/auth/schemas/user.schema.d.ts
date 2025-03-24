import { Document, Types } from 'mongoose';
export interface UserDocument extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    document: string;
    companyId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare class User {
    _id: Types.ObjectId;
    id: string;
    name: string;
    email: string;
    password: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
