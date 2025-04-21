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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGreenhouseReadings = exports.getSummary = exports.getGreenhouseReadings = void 0;
const greenhouseReadings_1 = __importDefault(require("../models/greenhouseReadings"));
const server_1 = require("../server");
const lightingModel_1 = __importDefault(require("../models/lightingModel"));
const ventilationModel_1 = __importDefault(require("../models/ventilationModel"));
const wateringModel_1 = __importDefault(require("../models/wateringModel"));
const handleSession = (model, sessionData, idField, updateFields, logPrefix) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionExists = yield model.exists({
            [idField]: sessionData[idField],
        });
        if (!sessionExists) {
            const newSession = yield model.create(sessionData);
            console.log(`${logPrefix}: newSession`, newSession);
        }
        else if (sessionData.end_time) {
            const updateData = updateFields.reduce((acc, field) => {
                if (sessionData[field] !== undefined)
                    acc[field] = sessionData[field];
                return acc;
            }, {});
            const updatedSession = yield model.findOneAndUpdate({ [idField]: sessionData[idField] }, updateData, { new: true });
            console.log(`${logPrefix}: updatedSession`, updatedSession);
        }
        else {
            console.log(`${logPrefix}: Session already exists with ID ${sessionData[idField]}`);
        }
    }
    catch (error) {
        throw new Error(`Error handling session: ${(_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error}`);
    }
});
const notifyWebSocketClients = (type, data) => {
    server_1.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
        }
    });
};
const getGreenhouseReadings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const greenHouseData = yield greenhouseReadings_1.default.find().sort({ _id: -1 }).limit(1000);
        const summary = yield (0, exports.getSummary)();
        if (summary)
            console.log("Ruben: summary", summary);
        res.status(200).json({ greenHouseData, summary });
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los datos :(" });
    }
});
exports.getGreenhouseReadings = getGreenhouseReadings;
const getSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const timeFrames = {
        global: {},
        last_month: { from: oneMonthAgo },
        last_week: { from: oneWeekAgo },
    };
    const result = {};
    for (const [label, frame] of Object.entries(timeFrames)) {
        const filter = "from" in frame
            ? {
                start_time: {
                    $gte: frame.from.toISOString().slice(0, 19).replace("T", " "),
                },
            }
            : {};
        const irrigations = yield wateringModel_1.default.find(filter).lean();
        const ventilations = yield ventilationModel_1.default.find(filter).lean();
        const lights = yield lightingModel_1.default.find(filter).lean();
        result[label] = {
            waterUsage: {
                current: irrigations.reduce((acc, r) => { var _a; return acc + (((_a = r.duration) === null || _a === void 0 ? void 0 : _a.toFixed) ? parseFloat(r.duration.toFixed(2)) : 0); }, 0),
                total_liters: irrigations.reduce((acc, r) => {
                    var _a;
                    return acc +
                        (((_a = r.consumption_liters) === null || _a === void 0 ? void 0 : _a.toFixed)
                            ? parseFloat(r.consumption_liters.toFixed(2))
                            : 0);
                }, 0),
                unit: "litros",
                description: "Consumo total de agua en litros",
            },
            fanUsage: {
                current: ventilations.reduce((acc, r) => {
                    var _a;
                    return acc +
                        (((_a = r.duration) === null || _a === void 0 ? void 0 : _a.toFixed) ? parseFloat(r.duration.toFixed(2)) : 0);
                }, 0) / 60,
                unit: "minutos",
                description: "Tiempo total de ventilación en minutos",
            },
            lightUsage: {
                current: lights.reduce((acc, r) => {
                    var _a;
                    return acc +
                        (((_a = r.duration) === null || _a === void 0 ? void 0 : _a.toFixed) ? parseFloat(r.duration.toFixed(2)) : 0);
                }, 0) / 60,
                unit: "minutos",
                description: "Tiempo total de iluminación en minutos",
            },
        };
    }
    return result;
});
exports.getSummary = getSummary;
const createGreenhouseReadings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const newGreenHouseData = yield greenhouseReadings_1.default.create((_a = req.body) === null || _a === void 0 ? void 0 : _a.sensor_values);
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.irrigation) {
            yield handleSession(wateringModel_1.default, req.body.irrigation, "irrigation_id", ["end_time", "duration", "consumption_liters"], "Ruben: Irrigation");
        }
        if ((_c = req.body) === null || _c === void 0 ? void 0 : _c.light) {
            yield handleSession(lightingModel_1.default, req.body.light, "light_id", ["end_time", "duration"], "Ruben: Light");
        }
        if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.ventilation) {
            yield handleSession(ventilationModel_1.default, req.body.ventilation, "ventilation_id", ["end_time", "duration"], "Ruben: Ventilation");
        }
        notifyWebSocketClients("newGreenhouseReading", newGreenHouseData);
        res.status(201).json({ newGreenHouseData });
    }
    catch (error) {
        console.log("Ruben: error", error);
        res.status(500).json({ message: "Error al crear al guardar los datos :(" });
    }
});
exports.createGreenhouseReadings = createGreenhouseReadings;
