import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import authMiddleware from "../middleware/authentication";

const router: Router = Router();

router.get("/users", authMiddleware, getUsers);
router.post("/users", createUser);

export default router;
