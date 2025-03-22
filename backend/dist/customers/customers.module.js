"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customers_service_1 = require("./customers.service");
const customers_controller_1 = require("./customers.controller");
const customer_schema_1 = require("./schemas/customer.schema");
const auth_module_1 = require("../auth/auth.module");
const companies_module_1 = require("../companies/companies.module");
const user_schema_1 = require("../auth/schemas/user.schema");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_schema_1.Customer.name, schema: customer_schema_1.CustomerSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
        ],
        controllers: [customers_controller_1.CustomersController],
        providers: [customers_service_1.CustomersService],
        exports: [customers_service_1.CustomersService],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map