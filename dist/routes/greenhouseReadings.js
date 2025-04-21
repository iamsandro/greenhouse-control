"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const greenhouseReadings_1 = require("../controllers/greenhouseReadings");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const dataTransform_1 = __importDefault(require("../middleware/dataTransform"));
const router = (0, express_1.Router)();
router.get("/greenhouse_readings", authentication_1.default, greenhouseReadings_1.getGreenhouseReadings);
router.post("/greenhouse_readings", dataTransform_1.default, greenhouseReadings_1.createGreenhouseReadings);
exports.default = router;
