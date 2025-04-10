import mongoose, { Schema } from "mongoose";

interface IWateringModel {
  _id: string;
  watering_status: string;
  start_time: Date;
  end_time: Date;
  watering_duration: Number;
  amount_water_used: Number;
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
}

const WateringSchema: Schema = new Schema({
  status: { type: String, enum: ["on", "off"] },
  irrigation_id: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String || null }, //todo: validar que sea requerido
  duration: { type: Number, required: true },
  consumption_liters: { type: Number || null, required: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deletedAt: { type: Date },
});

export default mongoose.model<IWateringModel>(
  "WateringSesions",
  WateringSchema,
);
