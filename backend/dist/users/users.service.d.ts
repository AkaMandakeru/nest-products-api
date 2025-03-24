import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
interface CreateUserData {
    email: string;
    name: string;
    document: string;
}
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findOrCreate(data: CreateUserData): Promise<import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(userId: string, data: Partial<CreateUserData>): Promise<(import("mongoose").Document<unknown, {}, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export {};
