import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { registerSocketHandlers } from "./socket/socket.js";

const app = express();
app.use(cors());

export const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

registerSocketHandlers(io);

httpServer.listen(3001, () => {
  console.log("Backend running on port 3001");
});
