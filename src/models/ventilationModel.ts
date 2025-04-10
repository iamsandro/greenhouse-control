import mongoose, { Schema } from "mongoose";

interface IVentilationModel {
  _id: string;
  ventilation_status: string;
  start_time: Date;
  end_time: Date;
  ventilation_duration: Number;
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
}

const VentilationSchema: Schema = new Schema({
  status: { type: String, enum: ["on", "off"], required: true },
  ventilation_id: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deletedAt: { type: Date },
});

export default mongoose.model<IVentilationModel>(
  "VentilationSesions",
  VentilationSchema,
);
