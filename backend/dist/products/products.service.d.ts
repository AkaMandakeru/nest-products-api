import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    create(createProductDto: CreateProductDto, userId: string, companyId: string): Promise<Product>;
    findAll(userId: string, query: ListProductsDto): Promise<{
        data: Product[];
        total: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product>;
    remove(id: string, userId: string): Promise<Product>;
    processUploadedFile(file: Express.Multer.File, userId: string, companyId: string): Promise<{
        created: number;
    }>;
    private createManyFromCsv;
}
