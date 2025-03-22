import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
export declare class Product {
    _id: Types.ObjectId;
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    userId: Types.ObjectId;
    companyId: Types.ObjectId;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
