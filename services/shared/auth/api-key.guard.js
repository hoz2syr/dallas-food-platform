"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const api_error_1 = require("../errors/api-error");
let ApiKeyGuard = class ApiKeyGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
        if (!process.env.API_KEY || !apiKey || apiKey !== process.env.API_KEY) {
            const body = (0, api_error_1.makeApiError)('UNAUTHORIZED', 'Invalid API key');
            throw new common_1.HttpException(body, common_1.HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)()
], ApiKeyGuard);
