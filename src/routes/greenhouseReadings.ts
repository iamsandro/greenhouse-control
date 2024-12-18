import { Router } from "express";
import {
    getGreenhouseReadings,
    createGreenhouseReadings,
} from "../controllers/greenhouseReadings";
import authMiddleware from "../middleware/authentication";

const router: Router = Router();

router.get("/greenhouse_readings", authMiddleware, getGreenhouseReadings);
router.post("/greenhouse_readings", createGreenhouseReadings);

export default router;
