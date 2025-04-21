"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const PORT = process.env.PORT ? +process.env.PORT : 5000;
const server = http_1.default.createServer(app_1.default);
const wss = new ws_1.WebSocketServer({ server });
exports.wss = wss;
wss.on("connection", (ws) => {
    console.log("Cliente WebSocket conectado");
    ws.on("message", (message) => {
        console.log("Mensaje recibido:", message);
    });
});
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor http y websocket corriendo en el puerto ${PORT}`);
});
