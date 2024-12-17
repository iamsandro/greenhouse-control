import mongoose, { Document, Schema } from "mongoose";

interface IControlSettings {
    intervaloMedicion: Number;
    umbralTemperaturaAlta: Number;
    umbralTemperaturaBaja: Number;
    umbralHumedadAlta: Number;
    umbralHumedadBaja: Number;
    horaInicioLuz: String;
    horaFinLuz: String;
    dispositivo: String;
    lastUpdated: String;
}

const ControlSettingsSchema: Schema = new Schema({
    intervaloMedicion: { type: Number, default: 300 },
    umbralTemperaturaAlta: { type: Number, default: 30 },
    umbralTemperaturaBaja: { type: Number, default: 15 },
    umbralHumedadAlta: { type: Number, default: 80 },
    umbralHumedadBaja: { type: Number, default: 40 },
    horaInicioLuz: String,
    horaFinLuz: String,
    lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model<IControlSettings>(
    "ControlSettings",
    ControlSettingsSchema,
);
