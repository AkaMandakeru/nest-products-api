"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const csv_parse_1 = require("csv-parse");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        const createdProduct = await this.productModel.create(createProductDto);
        return createdProduct;
    }
    async findAll() {
        return this.productModel.find().exec();
    }
    async createManyFromCsv(fileBuffer) {
        return new Promise((resolve, reject) => {
            const products = [];
            const parser = (0, csv_parse_1.parse)({
                delimiter: ',',
                columns: true,
                skip_empty_lines: true,
            });
            parser.on('readable', () => {
                let record;
                while ((record = parser.read()) !== null) {
                    const product = {
                        name: record.name,
                        description: record.description,
                        price: parseFloat(record.price),
                        quantity: parseInt(record.quantity, 10),
                    };
                    products.push(product);
                }
            });
            parser.on('error', (err) => {
                reject(err);
            });
            parser.on('end', async () => {
                try {
                    const result = await this.productModel.insertMany(products);
                    resolve(result.length);
                }
                catch (error) {
                    reject(error);
                }
            });
            parser.write(fileBuffer);
            parser.end();
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map