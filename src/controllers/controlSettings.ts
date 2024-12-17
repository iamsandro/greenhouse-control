import { Response, Request } from "express";
import ConfigMicroModel from "../models/controlSettings";

export const getConfigMicro = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    try {
        const configMicroList = await ConfigMicroModel.find();
        res.status(200).json({ configMicroList });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
};

export const createConfigMicro = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const newConfigMicro = await ConfigMicroModel.create(req.body);
        res.status(201).json({ newConfigMicro });
    } catch (error) {
        res.status(500).json({ message: "Error al crear configuración." });
    }
};
