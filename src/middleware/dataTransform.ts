import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  IDataTransformRequest,
  IIrrigation,
  ILight,
  ISensorValues,
} from "../types/types";
import { time, timeStamp } from "console";

const dataTransformMiddleware = async (
  req: Request & IDataTransformRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.body) {
    res.status(401).json({
      message: "No se proporcionó data",
    });

    return;
  }

  try {
    const { sensores, actuadores, timestamp } = req.body;

    if (!sensores || !actuadores || !timestamp) {
      res.status(400).json({
        message: "Faltan datos necesarios en el cuerpo de la solicitud",
      });
      return;
    }

    const sensor_values: ISensorValues = {
      humidity: sensores.humedad,
      temperature: sensores.temperatura,
      light: sensores.luz,
      soil_humidity: [
        sensores.humedad_suelo_1,
        sensores.humedad_suelo_2,
        sensores.humedad_suelo_3,
      ],
      fan_status: sensores.status_ventilador,
      irrigation_status: sensores.status_riego,
      light_status: sensores.status_luz,
      timestamp: timestamp,
    };

    const irrigation: IIrrigation | null = actuadores.riego
      ? {
          status: actuadores.riego.estado,
          irrigation_id: actuadores.riego.riego_id,
          start_time: actuadores.riego.riego_start_time,
          end_time: actuadores.riego.riego_end_time || null,
          duration: actuadores.riego.riego_duration,
          consumption_liters: actuadores.riego.consumo_litros,
        }
      : null;

    const light: ILight | null = actuadores.iluminacion
      ? {
          status: actuadores.iluminacion.estado,
          light_id: actuadores.iluminacion.luz_id,
          start_time: actuadores.iluminacion.luz_start_time,
          end_time: actuadores.iluminacion.luz_end_time,
          duration: actuadores.iluminacion.luz_duration,
        }
      : null;

    const ventilation = actuadores.ventilación
      ? {
          status: actuadores.ventilación.estado,
          ventilation_id: actuadores.ventilación.ventilacion_id,
          start_time: actuadores.ventilación.ventilacion_start_time,
          end_time: actuadores.ventilación.ventilacion_end_time,
          duration: actuadores.ventilación.ventilacion_duration,
        }
      : null;

    req.body = { sensor_values, light, irrigation, ventilation, timestamp };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });

    return;
  }
};

export default dataTransformMiddleware;
