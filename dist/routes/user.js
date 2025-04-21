"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get("/users", authentication_1.default, userController_1.getUsers);
router.post("/users", userController_1.createUser);
exports.default = router;
