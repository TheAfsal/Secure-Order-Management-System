import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "winston";

import completedOrders from "./routes/completedOrders.js";
import buyerRouter from "./routes/buyerRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";

const app = express();

dotenv.config({
  path: "./config/.env",
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("Nice working.");
});

// Cross-Origin Resource Sharing (CORS) configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

logger.configure({
  transports: [
    new logger.transports.Console(),
    new logger.transports.File({ filename: "server.log" }),
  ],
});

// Routes
app.use("/orders", buyerRouter);
app.use("/orders", sellerRouter);

app.use("/orders", completedOrders);

export { app, logger };
