import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "winston";

import orderRouter from "./routes/orderRoutes.js";

const app = express();

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
app.use("/orders", orderRouter);

export { app, logger };
