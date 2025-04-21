"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataTransformMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const sensor_values = {
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
        const irrigation = actuadores.riego
            ? {
                status: actuadores.riego.estado,
                irrigation_id: actuadores.riego.riego_id,
                start_time: actuadores.riego.riego_start_time,
                end_time: actuadores.riego.riego_end_time || null,
                duration: actuadores.riego.riego_duration,
                consumption_liters: actuadores.riego.consumo_litros,
            }
            : null;
        const light = actuadores.iluminacion
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
    }
    catch (error) {
        res.status(401).json({ message: "Token inválido" });
        return;
    }
});
exports.default = dataTransformMiddleware;
