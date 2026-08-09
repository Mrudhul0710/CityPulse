import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./shared/middlewares/errorHandler.js";
import { env } from "./config/env.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", routes);

  // Order matters: 404 handler after all routes, error handler last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
