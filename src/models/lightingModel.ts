import mongoose, { Schema } from "mongoose";

interface ILightingModel {
  _id: string;
  lighting_status: string;
  start_time: Date;
  end_time: Date;
  lighting_duration: Number;
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
}

const LightingModelSchema: Schema = new Schema({
  status: { type: String, enum: ["on", "off"], requiered: true },
  light_id: { type: String, required: true },
  start_time: { type: String, requiered: true },
  end_time: { type: String },
  duration: { type: Number, requiered: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deletedAt: { type: Date },
});

export default mongoose.model<ILightingModel>(
  "LightingSesion",
  LightingModelSchema,
);
