import { Response, Request } from "express";
import GreenhouseReadings, {
  IGreenhouseReadings,
} from "../models/greenhouseReadings";
import { wss } from "../server";
import LightingSesion from "../models/lightingModel";
import VentilationSesions from "../models/ventilationModel";
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

    const summary = await getSummary();
    if (summary) console.log("Ruben: summary", summary);
    res.status(200).json({ greenHouseData, summary });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos :(" });
  }
};

export const getSummary = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const timeFrames = {
    global: {},
    last_month: { from: oneMonthAgo },
    last_week: { from: oneWeekAgo },
  };

  const result: Record<
    string,
    {
      waterUsage: {
        current: number;
        unit: string;
        description: string;
        total_liters: number;
      };
      fanUsage: { current: number; unit: string; description: string };
      lightUsage: { current: number; unit: string; description: string };
    }
  > = {};

  for (const [label, frame] of Object.entries(timeFrames)) {
    const filter =
      "from" in frame
        ? {
            start_time: {
              $gte: frame.from.toISOString().slice(0, 19).replace("T", " "),
            },
          }
        : {};

    const irrigations = await WateringSesions.find(filter).lean();
    const ventilations = await VentilationSesions.find(filter).lean();
    const lights = await LightingSesion.find(filter).lean();

    result[label] = {
      waterUsage: {
        current: irrigations.reduce(
          (acc, r: any) =>
            acc + (r.duration?.toFixed ? parseFloat(r.duration.toFixed(2)) : 0),
          0,
        ),
        total_liters: irrigations.reduce(
          (acc, r: any) =>
            acc +
            (r.consumption_liters?.toFixed
              ? parseFloat(r.consumption_liters.toFixed(2))
              : 0),
          0,
        ),
        unit: "litros",
        description: "Consumo total de agua en litros",
      },
      fanUsage: {
        current:
          ventilations.reduce(
            (acc, r: any) =>
              acc +
              (r.duration?.toFixed ? parseFloat(r.duration.toFixed(2)) : 0),
            0,
          ) / 60,
        unit: "minutos",
        description: "Tiempo total de ventilación en minutos",
      },
      lightUsage: {
        current:
          lights.reduce(
            (acc, r: any) =>
              acc +
              (r.duration?.toFixed ? parseFloat(r.duration.toFixed(2)) : 0),
            0,
          ) / 60,
        unit: "minutos",
        description: "Tiempo total de iluminación en minutos",
      },
    };
  }

  return result;
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
        LightingSesion,
        req.body.light,
        "light_id",
        ["end_time", "duration"],
        "Ruben: Light",
      );
    }

    if (req.body?.ventilation) {
      await handleSession(
        VentilationSesions,
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
