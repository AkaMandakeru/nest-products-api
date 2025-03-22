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
const product_schema_1 = require("./schemas/product.schema");
const csv = require("csv-parse");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto, userId, companyId) {
        const product = new this.productModel({
            ...createProductDto,
            userId: new mongoose_2.Types.ObjectId(userId),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        });
        return product.save();
    }
    async findAll(userId, query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const [data, total] = await Promise.all([
            this.productModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments(filter),
        ]);
        const pages = Math.ceil(total / limit);
        return { data, total, pages };
    }
    async findOne(id, userId) {
        const product = await this.productModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto, userId) {
        const product = await this.productModel.findOneAndUpdate({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        }, { $set: updateProductDto }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async remove(id, userId) {
        const product = await this.productModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async processUploadedFile(file, userId, companyId) {
        const createdCount = await this.createManyFromCsv(file.buffer, userId, companyId);
        return { created: createdCount };
    }
    async createManyFromCsv(fileBuffer, userId, companyId) {
        const records = [];
        const parser = csv.parse({
            delimiter: ',',
            columns: true,
            skip_empty_lines: true,
        });
        const parsePromise = new Promise((resolve, reject) => {
            parser.on('readable', function () {
                let record;
                while ((record = parser.read()) !== null) {
                    records.push(record);
                }
            });
            parser.on('error', reject);
            parser.on('end', resolve);
        });
        parser.write(fileBuffer);
        parser.end();
        await parsePromise;
        const products = records.map((record) => ({
            name: record.name,
            description: record.description,
            price: parseFloat(record.price),
            quantity: parseInt(record.quantity, 10) || 0,
            userId: new mongoose_2.Types.ObjectId(userId),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        }));
        const result = await this.productModel.insertMany(products);
        return result.length;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map