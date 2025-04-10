import { Response, Request } from "express";
import GreenhouseReadings, {
  IGreenhouseReadings,
} from "../models/greenhouseReadings";
import { wss } from "../server";
import lightingModel from "../models/lightingModel";
import ventilationModel from "../models/ventilationModel";
import WateringSesions from "../models/wateringModel";

const handleSession = async (
  model: any,
  sessionData: any,
  idField: string,
  updateFields: string[],
  logPrefix: string,
) => {
  try {
    const sessionExists = await model.exists({
      [idField]: sessionData[idField],
    });

    if (!sessionExists) {
      const newSession = await model.create(sessionData);
      console.log(`${logPrefix}: newSession`, newSession);
    } else if (sessionData.end_time) {
      const updateData = updateFields.reduce((acc, field) => {
        if (sessionData[field] !== undefined) acc[field] = sessionData[field];
        return acc;
      }, {} as Record<string, any>);

      const updatedSession = await model.findOneAndUpdate(
        { [idField]: sessionData[idField] },
        updateData,
        { new: true },
      );
      console.log(`${logPrefix}: updatedSession`, updatedSession);
    } else {
      console.log(
        `${logPrefix}: Session already exists with ID ${sessionData[idField]}`,
      );
    }
  } catch (error: any) {
    throw new Error(`Error handling session: ${error?.message ?? error}`);
  }
};

const notifyWebSocketClients = (type: string, data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
};

export const getGreenhouseReadings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const greenHouseData: IGreenhouseReadings[] =
      await GreenhouseReadings.find().sort({ _id: -1 }).limit(1000);
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
      await GreenhouseReadings.create(req.body?.sensor_values);

    if (req.body?.irrigation) {
      await handleSession(
        WateringSesions,
        req.body.irrigation,
        "irrigation_id",
        ["end_time", "duration", "consumption_liters"],
        "Ruben: Irrigation",
      );
    }

    if (req.body?.light) {
      await handleSession(
        lightingModel,
        req.body.light,
        "light_id",
        ["end_time", "duration"],
        "Ruben: Light",
      );
    }

    if (req.body?.ventilation) {
      await handleSession(
        ventilationModel,
        req.body.ventilation,
        "ventilation_id",
        ["end_time", "duration"],
        "Ruben: Ventilation",
      );
    }

    notifyWebSocketClients("newGreenhouseReading", newGreenHouseData);

    res.status(201).json({ newGreenHouseData });
  } catch (error) {
    console.log("Ruben: error", error);
    res.status(500).json({ message: "Error al crear al guardar los datos :(" });
  }
};
