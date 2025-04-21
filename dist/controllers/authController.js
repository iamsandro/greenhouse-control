"use strict";
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
exports.register = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            res.status(400).json({
                message: "Todos los campos son obligatorios",
            });
        const user = yield user_1.default.findOne({ username });
        console.log("Ruben: user", user);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Contraseña incorrecta" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET || "tu_clave_secreta", { expiresIn: "2 days" });
        res.status(200).json({ message: "login exitoso", token });
    }
    catch (error) {
        res.status(500).json({ message: "Error al intentar loguear" });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.create(req.body);
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET || "tu_clave_secreta", { expiresIn: "2 days" });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.log("Ruben: error", error);
        res.status(500).json(error);
    }
});
exports.register = register;
