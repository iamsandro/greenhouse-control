import { Router } from "express";
import {
    getConfigMicro,
    createConfigMicro,
} from "../controllers/controlSettings";
import authMiddleware from "../middleware/authentication";
const router: Router = Router();

router.get("/config", authMiddleware, getConfigMicro);
router.post("/config", authMiddleware, createConfigMicro);

export default router;
