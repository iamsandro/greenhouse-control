import { Response, Request } from "express";
import GreenhouseReadings, {
    IGreenhouseReadings,
} from "../models/greenhouseReadings";
import { wss } from "../server";

export const getGreenhouseReadings = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const greenHouseData: IGreenhouseReadings[] =
            await GreenhouseReadings.find();
        res.status(200).json({ greenHouseData });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los datos :(" });
    }
};

export const createGreenhouseReadings = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const newGreenHouseData: IGreenhouseReadings =
            await GreenhouseReadings.create(req.body);

        // Envía notificación a todos los clientes WebSocket
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        type: "newGreenhouseReading",
                        data: newGreenHouseData,
                    }),
                );
            }
        });

        res.status(201).json({ newGreenHouseData });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear al guardar los datos :(",
        });
    }
};
