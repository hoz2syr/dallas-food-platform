"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client = new pg_1.Client({
    host: process.env.POSTGRES_HOST || process.env.POSTGRES_SERVICE || 'postgres',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || 'dallas',
    user: process.env.POSTGRES_USER || 'dallas',
    password: process.env.POSTGRES_PASSWORD || 'dallas'
});
exports.client = client;
// Connect and run initial schema migration. Fail fast if migration fails.
(async () => {
    try {
        await client.connect();
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFile = path.join(migrationsDir, '001-create-orders-table.sql');
        if (fs.existsSync(migrationFile)) {
            const sql = fs.readFileSync(migrationFile, 'utf8');
            await client.query(sql);
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Postgres initialization error:', message);
        // Fail fast
        process.exit(1);
    }
})();
