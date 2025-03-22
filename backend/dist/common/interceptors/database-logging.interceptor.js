"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let DatabaseLoggingInterceptor = class DatabaseLoggingInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        console.log(`[Database Operation] ${method} ${url}`);
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const responseTime = Date.now() - now;
            console.log(`[Database Response] ${method} ${url} - ${responseTime}ms`);
            console.log('[Database Data]', JSON.stringify(data, null, 2));
        }));
    }
};
exports.DatabaseLoggingInterceptor = DatabaseLoggingInterceptor;
exports.DatabaseLoggingInterceptor = DatabaseLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], DatabaseLoggingInterceptor);
//# sourceMappingURL=database-logging.interceptor.js.map