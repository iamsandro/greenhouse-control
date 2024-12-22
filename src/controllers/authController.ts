import { Express, Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            res.status(400).json({
                message: "Todos los campos son obligatorios",
            });

        const user = await User.findOne({ username });
        console.log("Ruben: user", user);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Contraseña incorrecta" });
            return;
        }

        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET || "tu_clave_secreta",
            { expiresIn: "2 days" },
        );

        res.status(200).json({ message: "login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error al intentar loguear" });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser = await User.create(req.body);

        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET || "tu_clave_secreta",
            { expiresIn: "2 days" },
        );
        res.status(201).json({ user, token });
    } catch (error) {
        console.log("Ruben: error", error);
        res.status(500).json(error);
    }
};
