"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const products_module_1 = require("./products/products.module");
const auth_module_1 = require("./auth/auth.module");
const logging_middleware_1 = require("./common/middleware/logging.middleware");
const database_logging_interceptor_1 = require("./common/interceptors/database-logging.interceptor");
const companies_module_1 = require("./companies/companies.module");
const customers_module_1 = require("./customers/customers.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logging_middleware_1.LoggingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI') || 'mongodb://localhost:27017/products',
                }),
                inject: [config_1.ConfigService],
            }),
            products_module_1.ProductsModule,
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
            customers_module_1.CustomersModule,
            users_module_1.UsersModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: database_logging_interceptor_1.DatabaseLoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map