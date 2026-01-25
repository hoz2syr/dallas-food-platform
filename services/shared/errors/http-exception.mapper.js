"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToApiError = mapToApiError;
const api_error_1 = require("./api-error");
const common_1 = require("@nestjs/common");
function mapToApiError(err) {
    // Nest HttpException passthrough
    if (err instanceof common_1.HttpException) {
        const status = err.getStatus();
        const response = err.getResponse();
        if (typeof response === 'string') {
            return { status, body: (0, api_error_1.makeApiError)(String(status), response) };
        }
        // If it's already an object, try to normalize
        const message = response.message || JSON.stringify(response);
        const code = response.code || String(status);
        return { status, body: (0, api_error_1.makeApiError)(code, message, response) };
    }
    // Domain errors mapping by name to avoid cross-service class imports
    if (err instanceof Error) {
        const name = err.name || 'DomainError';
        // Menu errors
        if (name === 'EmptyMenuItemsError' || name === 'InvalidMenuNameError' || name === 'MenuDomainError') {
            return { status: common_1.HttpStatus.BAD_REQUEST, body: (0, api_error_1.makeApiError)(name, err.message) };
        }
        // Order errors
        if (name === 'EmptyOrderItemsError') {
            return { status: common_1.HttpStatus.BAD_REQUEST, body: (0, api_error_1.makeApiError)(name, err.message) };
        }
        if (name === 'InvalidOrderStateError') {
            return { status: common_1.HttpStatus.CONFLICT, body: (0, api_error_1.makeApiError)(name, err.message) };
        }
        if (name === 'OrderDomainError') {
            return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, body: (0, api_error_1.makeApiError)(name, err.message) };
        }
    }
    // Fallback unknown error
    const fallback = (0, api_error_1.makeApiError)(api_error_1.INTERNAL_ERROR_CODE, err?.message || 'An internal error occurred', err);
    return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, body: fallback };
}
