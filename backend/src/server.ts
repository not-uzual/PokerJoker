import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { registerSocketHandlers } from "./socket/socket.js";
import dotenv from "dotenv";
dotenv.config()

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL
}));


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

registerSocketHandlers(io);

httpServer.listen(3001, () => {
  console.log("Backend running on port 3001");
});
