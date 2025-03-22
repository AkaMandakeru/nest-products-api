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
const customer_schema_1 = require("./schemas/customer.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const auth_service_1 = require("../auth/auth.service");
let CustomersService = class CustomersService {
    customerModel;
    userModel;
    authService;
    constructor(customerModel, userModel, authService) {
        this.customerModel = customerModel;
        this.userModel = userModel;
        this.authService = authService;
    }
    async create(createCustomerDto, companyId) {
        let user = await this.userModel.findOne({
            $or: [
                { email: createCustomerDto.email },
                { document: createCustomerDto.document },
            ],
        });
        if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const { user: newUser } = await this.authService.register({
                email: createCustomerDto.email,
                password,
                name: createCustomerDto.name,
                document: createCustomerDto.document,
            });
            user = await this.userModel.findById(newUser.id);
            if (!user) {
                throw new Error('Failed to create user');
            }
        }
        const customer = new this.customerModel({
            userId: new mongoose_2.Types.ObjectId(user.id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
            code: createCustomerDto.code,
            name: createCustomerDto.name,
            phone: createCustomerDto.phone,
            address: createCustomerDto.address,
        });
        return customer.save();
    }
    async findAll(companyId) {
        return this.customerModel
            .find({ companyId: new mongoose_2.Types.ObjectId(companyId) })
            .populate('userId', 'email name document')
            .exec();
    }
    async findOne(id, companyId) {
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
    async findByCode(code, companyId) {
        return this.customerModel
            .findOne({
            code,
            companyId: new mongoose_2.Types.ObjectId(companyId),
        })
            .populate('userId', 'email name document')
            .exec();
    }
    async update(id, updateCustomerDto, companyId) {
        const customer = await this.customerModel
            .findOneAndUpdate({
            _id: new mongoose_2.Types.ObjectId(id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        }, { $set: updateCustomerDto }, { new: true })
            .populate('userId', 'email name document');
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async remove(id, companyId) {
        const result = await this.customerModel.deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
            companyId: new mongoose_2.Types.ObjectId(companyId),
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Customer not found');
        }
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        auth_service_1.AuthService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map