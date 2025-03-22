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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const list_products_dto_1 = require("./dto/list-products.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const companies_service_1 = require("../companies/companies.service");
let ProductsController = class ProductsController {
    productsService;
    companiesService;
    constructor(productsService, companiesService) {
        this.productsService = productsService;
        this.companiesService = companiesService;
    }
    async create(createProductDto, user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before adding products');
        }
        const company = await this.companiesService.findByUserId(user.id);
        return this.productsService.create(createProductDto, user.id, company._id.toString());
    }
    async findAll(user, query) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before viewing products');
        }
        return this.productsService.findAll(user.id, query);
    }
    async findOne(id, user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before viewing products');
        }
        return this.productsService.findOne(id, user.id);
    }
    async update(id, updateProductDto, user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before updating products');
        }
        return this.productsService.update(id, updateProductDto, user.id);
    }
    async remove(id, user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before deleting products');
        }
        return this.productsService.remove(id, user.id);
    }
    async uploadFile(file, user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        if (!hasCompany) {
            throw new common_1.BadRequestException('You must register your company before uploading products');
        }
        const company = await this.companiesService.findByUserId(user.id);
        return this.productsService.processUploadedFile(file, user.id, company._id.toString());
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, list_products_dto_1.ListProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto,
        user_schema_1.User]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadFile", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        companies_service_1.CompaniesService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map