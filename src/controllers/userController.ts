import { Request, Response } from "express";
import User, { IUser } from "../models/user";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users: IUser[] = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos :(" });
    }
};

export const createUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        console.log("Ruben: req.body", req.body);
        const user: IUser = await User.create(req.body);
        res.status(201).json({ user });
    } catch (error) {
        console.log("Ruben: error", error);
        res.status(500).json(error);
    }
};
