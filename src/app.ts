import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import chalk from "chalk";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

import AppError from "./util/appError";
import GlobalErrorHandler from "./controllers/controllers_errors";

import glossaryRoutes from "./routes/routes_glossary";
import manHourRoutes from "./routes/routes_manHour";
import taskRoutes from "./routes/routes_task";
import memoryRoutes from "./routes/routes_memory";
import userRoutes from "./routes/routes_users";
import statsRoutes from "./routes/routes_stats";
import estimateRoutes from "./routes/routes_estimate";

const app = express();

//Set security HTTP headers
app.use(helmet());

//Limit requests from same IP address
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: `Too many requrests from this IP, Pleas try again in an hour!`
});
app.use('/api', limiter);

//Data Sanitization aganist NoSQL query injection
app.use(ExpressMongoSanitize());

//Morgan Log History
morgan.token("ip", (req: Request) => {
  return chalk.yellowBright(`${req.ip || "-"}`);
});
morgan.token("status", (req: Request, res: Response) => {
  return chalk.green((res.statusCode || "-").toString());
});
morgan.token("localDate", () => {
  const date = new Date();
  return chalk.redBright(date.toLocaleString());
});
morgan.format(
  "Watching",
  `:method to :url with (:status) statusCode in :response-time ms response-time! The request comes from :ip at :localDate`
);
app.use(morgan("Watching"));

//Body parser, cors middleware
app.use(cors());
app.use(express.json());

//Router Setting
app.use("/api/user", userRoutes);
app.use("/api/glossary", glossaryRoutes);
app.use("/api/manHour", manHourRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/estimate", estimateRoutes);

//Invaild URL Handler
app.all("*", (req, res, next: NextFunction) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
  next(error)
});

//Global Error Handler
app.use(GlobalErrorHandler);

export default app;
