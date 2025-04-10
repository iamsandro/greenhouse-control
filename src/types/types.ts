import { Request } from "express";

export interface ISensorValues {
  humidity: number;
  temperature: number;
  light: number;
  soil_humidity: [number, number, number];
  fan_status: "on" | "off";
  irrigation_status: "on" | "off";
  light_status: "on" | "off";
  timestamp: "string";
}

export interface ILight {
  status: "on" | "off";
  light_id: string;
  start_time: string;
  end_time: string;
  duration: number;
}

export interface IIrrigation {
  status: "on" | "off";
  irrigation_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  consumption_liters: number;
}

export interface IVentilation {
  status: "on" | "off";
  ventilation_id: string;
  start_time: string;
  end_time: string;
  duration: number;
}

export interface IDataTransformRequest extends Request {
  sensor_values: ISensorValues;
  light: ILight | null;
  irrigation: IIrrigation | null;
  ventilation: IVentilation | null;
  timestamp: string;
}
