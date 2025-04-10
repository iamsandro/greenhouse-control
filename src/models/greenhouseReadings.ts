import mongoose, { Document, Schema } from "mongoose";

export interface IGreenhouseReadings {
  temperature: Number;
  humidity: Number[];
  luminosity: Number;
  water_consumed: Number;
  water_rate: Number;
  gas_concentration: Number;
  watering_status: Boolean;
  fan_status: Boolean;
  light_status: Boolean;
}

const GreenhouseReadingsSchema: Schema = new Schema({
  humidity: { type: Number, required: true },
  temperature: { type: Number, required: true },
  light: { type: Number, required: true },
  soil_humidity: { type: Array },
  fan_status: { type: String, enum: ["on", "off"], required: true },
  irrigation_status: { type: String, enum: ["on", "off"], required: true },
  light_status: { type: String, enum: ["on", "off"], required: true },
  timestamp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deletedAt: { type: Date },
});

export default mongoose.model<IGreenhouseReadings>(
  "GreenhouseReadings",
  GreenhouseReadingsSchema,
);
