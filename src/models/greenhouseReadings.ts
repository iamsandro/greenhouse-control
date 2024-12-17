import mongoose, { Document, Schema } from "mongoose";

export interface IGreenhouseReadings {
    timestamp: String;
    temperatura: Number;
    humedad: Number;
    luminosidad: Number;
    concentracionGas: Number;
    estadoRiego: Boolean;
    estadoVentilador: Boolean;
    estadoLuzLed: Boolean;
    dispositivo: String;
}

const GreenhouseReadingsSchema: Schema = new Schema({
    temperatura: { type: Number },
    humedad: { type: Number },
    luminosidad: Number,
    concentracionGas: Number,
    estadoRiego: { type: Boolean, default: false },
    estadoVentilador: { type: Boolean, default: false },
    estadoLuzLed: { type: Boolean, default: false },
    dispositivo: { type: Schema.Types.ObjectId, ref: "Dispositivo" },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date },
    deletedAt: { type: Date },
});

export default mongoose.model<IGreenhouseReadings>(
    "GreenhouseReadings",
    GreenhouseReadingsSchema,
);
