"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const user_1 = __importDefault(require("./routes/user"));
const greenhouseReadings_1 = __importDefault(require("./routes/greenhouseReadings"));
const controlSettings_1 = __importDefault(require("./routes/controlSettings"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", [
    user_1.default,
    greenhouseReadings_1.default,
    controlSettings_1.default,
    authRoute_1.default,
]);
(0, database_1.default)();
exports.default = app;
