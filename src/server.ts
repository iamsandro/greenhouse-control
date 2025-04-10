import app from "./app";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import http from "http";

dotenv.config();

const PORT: number = process.env.PORT ? +process.env.PORT : 5000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente WebSocket conectado");

  ws.on("message", (message) => {
    console.log("Mensaje recibido:", message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor http y websocket corriendo en el puerto ${PORT}`);
});

export { wss };
