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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const create_company_dto_1 = require("./dto/create-company.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    create(createCompanyDto, user) {
        return this.companiesService.create(createCompanyDto, user.id);
    }
    findOne(user) {
        return this.companiesService.findByUserId(user.id);
    }
    update(updateCompanyDto, user) {
        return this.companiesService.update(user.id, updateCompanyDto);
    }
    async hasCompany(user) {
        const hasCompany = await this.companiesService.hasCompany(user.id);
        let company = null;
        if (hasCompany) {
            company = await this.companiesService.findByUserId(user.id);
        }
        return { hasCompany, company };
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto, user_schema_1.User]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto,
        user_schema_1.User]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('exists'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "hasCompany", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map