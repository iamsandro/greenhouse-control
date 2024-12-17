import { Router } from "express";
import {
    getGreenhouseReadings,
    createGreenhouseReadings,
} from "../controllers/greenhouseReadings";
import authMiddleware from "../middleware/authentication";

const router: Router = Router();

router.get("/greenhouse", authMiddleware, getGreenhouseReadings);
router.post("/greenhouse", authMiddleware, createGreenhouseReadings);

export default router;
