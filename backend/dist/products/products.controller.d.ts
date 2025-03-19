import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    uploadCsv(file: Express.Multer.File): Promise<{
        created: number;
    }>;
    findAll(): Promise<Product[]>;
}
