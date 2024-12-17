"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const greenhouseReadingsController_1 = require("../controllers/greenhouseReadingsController");
const router = (0, express_1.Router)();
router.get("/greenhouse", greenhouseReadingsController_1.getGreenhouseReadings);
router.post(
    "/greenhouse",
    greenhouseReadingsController_1.createGreenhouseReadings,
);
exports.default = router;
