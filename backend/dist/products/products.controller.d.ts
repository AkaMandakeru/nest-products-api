import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { User } from '../auth/schemas/user.schema';
import { CompaniesService } from '../companies/companies.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly companiesService;
    constructor(productsService: ProductsService, companiesService: CompaniesService);
    create(createProductDto: CreateProductDto, user: User): Promise<import("./schemas/product.schema").Product>;
    findAll(user: User, query: ListProductsDto): Promise<{
        data: import("./schemas/product.schema").Product[];
        total: number;
        pages: number;
    }>;
    findOne(id: string, user: User): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto, user: User): Promise<import("./schemas/product.schema").Product>;
    remove(id: string, user: User): Promise<import("./schemas/product.schema").Product>;
    uploadFile(file: Express.Multer.File, user: User): Promise<{
        created: number;
    }>;
}
