import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});