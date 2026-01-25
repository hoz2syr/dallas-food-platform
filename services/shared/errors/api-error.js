"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_ERROR_CODE = void 0;
exports.makeApiError = makeApiError;
function makeApiError(code, message, details) {
    return { code, message, details };
}
exports.INTERNAL_ERROR_CODE = 'INTERNAL_ERROR';
