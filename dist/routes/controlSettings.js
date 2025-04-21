"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controlSettings_1 = require("../controllers/controlSettings");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = (0, express_1.Router)();
router.get("/config", authentication_1.default, controlSettings_1.getConfigMicro);
router.post("/config", authentication_1.default, controlSettings_1.createConfigMicro);
exports.default = router;
