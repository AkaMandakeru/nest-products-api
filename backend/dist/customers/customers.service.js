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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const customer_schema_1 = require("./schemas/customer.schema");
const users_service_1 = require("../users/users.service");
let CustomersService = class CustomersService {
    customerModel;
    usersService;
    constructor(customerModel, usersService) {
        this.customerModel = customerModel;
        this.usersService = usersService;
    }
    generateCustomerCode() {
        return (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
    }
    async ensureUniqueCode(companyId) {
        let code;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        while (!isUnique && attempts < maxAttempts) {
            code = this.generateCustomerCode();
            const existingCustomer = await this.customerModel.findOne({
                companyId: new mongoose_2.Types.ObjectId(companyId),
                code,
            });
            if (!existingCustomer) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error('Failed to generate unique customer code');
        }
        return code;
    }
    async create(companyId, createCustomerDto) {
        if (!mongoose_2.Types.ObjectId.isValid(companyId)) {
            throw new common_1.NotFoundException('Invalid company ID');
        }
        const code = await this.ensureUniqueCode(companyId);
        const user = await this.usersService.findOrCreate({
            email: createCustomerDto.email,
            document: createCustomerDto.document,
            name: createCustomerDto.name,
        });
        const customer = new this.customerModel({
            userId: user._id,
            companyId: new mongoose_2.Types.ObjectId(companyId),
            code,
            name: createCustomerDto.name,
            phone: createCustomerDto.phone,
            address: createCustomerDto.address,
            isActive: true,
        });
        return customer.save();
    }
    async findAll(companyId) {
        if (!companyId) {
            return [];
        }
        if (!mongoose_2.Types.ObjectId.isValid(companyId)) {
            throw new common_1.NotFoundException('Invalid company ID');
        }
        return this.customerModel
            .find({ companyId: new mongoose_2.Types.ObjectId(companyId) })
            .populate('userId', 'email name document')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(companyId, id) {
        if (!mongoose_2.Types.ObjectId.isValid(companyId)) {
            throw new common_1.NotFoundException('Invalid company ID');
        }
        const customer = await this.customerModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        })
            .populate('userId', 'email name document')
            .exec();
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async update(companyId, id, updateCustomerDto) {
        if (!mongoose_2.Types.ObjectId.isValid(companyId)) {
            throw new common_1.NotFoundException('Invalid company ID');
        }
        const customer = await this.customerModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        })
            .exec();
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        if (updateCustomerDto.email || updateCustomerDto.name || updateCustomerDto.document) {
            await this.usersService.update(customer.userId.toString(), {
                email: updateCustomerDto.email,
                name: updateCustomerDto.name,
                document: updateCustomerDto.document,
            });
        }
        Object.assign(customer, {
            name: updateCustomerDto.name,
            phone: updateCustomerDto.phone,
            address: updateCustomerDto.address,
        });
        return customer.save();
    }
    async remove(companyId, id) {
        if (!mongoose_2.Types.ObjectId.isValid(companyId)) {
            throw new common_1.NotFoundException('Invalid company ID');
        }
        const customer = await this.customerModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        })
            .exec();
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        await customer.deleteOne();
        return { id };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map