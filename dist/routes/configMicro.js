"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configMicroController_1 = require("../controllers/configMicroController");
const router = (0, express_1.Router)();
router.get("/config", configMicroController_1.getConfigMicro);
router.post("/config", configMicroController_1.createConfigMicro);
exports.default = router;
