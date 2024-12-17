import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Ruben: authMiddleware -> token", token);

    if (!token) {
        res.status(401).json({
            message: "No se proporcionó token de autenticación",
        });

        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "tu_clave_secreta",
        );
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });

        return;
    }
};

export default authMiddleware;
