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
    temperature: { type: Number },
    humidity: { type: Array },
    luminosity: Number,
    gas_concentration: Number,
    water_consumed: Number,
    water_rate: Number,
    watering_status: { type: String, enum: ["on", "off"] },
    fan_status: { type: String, enum: ["on", "off"] },
    light_status: { type: String, enum: ["on", "off"] },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date },
    deletedAt: { type: Date },
});

export default mongoose.model<IGreenhouseReadings>(
    "GreenhouseReadings",
    GreenhouseReadingsSchema,
);
