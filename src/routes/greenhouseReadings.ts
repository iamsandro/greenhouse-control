import { RequestHandler, Router } from "express";
import {
  getGreenhouseReadings,
  createGreenhouseReadings,
} from "../controllers/greenhouseReadings";
import authMiddleware from "../middleware/authentication";
import dataTransformMiddleware from "../middleware/dataTransform";

const router: Router = Router();

router.get("/greenhouse_readings", authMiddleware, getGreenhouseReadings);
router.post(
  "/greenhouse_readings",
  dataTransformMiddleware as unknown as RequestHandler,
  createGreenhouseReadings,
);

export default router;
