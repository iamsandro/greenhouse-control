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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import dotenv from 'dotenv';
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = process.env.USER;
        const password = process.env.PASSWORD;
        const dbName = process.env.DB_NAME;
        const mongoURI = process.env.MONGO_URI || "";
        // const mongoURI =  `mongodb://${user}:${password}@127.0.0.1:27017/${dbName}?authSource=admin`;
        console.log("Ruben: mongoURI", mongoURI);
        yield mongoose_1.default.connect(mongoURI);
        console.log("MongoDB conectado");
        // const db = mongoose.connection.db;
        const admin = (_b = (_a = mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) === null || _b === void 0 ? void 0 : _b.admin();
        const dbList = yield (admin === null || admin === void 0 ? void 0 : admin.listDatabases());
        const dbExists = dbList === null || dbList === void 0 ? void 0 : dbList.databases.some((db) => db.name === dbName);
        if (!dbExists) {
            console.log(`Base de datos '${dbName}' creada.`);
        }
        else {
            console.log(`Base de datos '${dbName}' ya existe.`);
        }
    }
    catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
});
exports.default = connectDB;
