import express, { Express } from "express";
import cors from "cors";
import connectDB from "./config/database";
import UserRoute from "./routes/user";
import GreenhouseReadingsRoute from "./routes/greenhouseReadings";
import ConfigMicroRoute from "./routes/controlSettings";
import AuthRoute from "./routes/authRoute";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", [
    UserRoute,
    GreenhouseReadingsRoute,
    ConfigMicroRoute,
    AuthRoute,
]);

connectDB();

export default app;
