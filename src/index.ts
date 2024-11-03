import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { dbObj } from "../drizzle/db";
import router from "./routes";
import { logger } from "./utils/Logger";
import { BlockedWebsiteService } from "./services/BlockedWebsiteService";
import { myEventListener } from "./utils/notificationsListener";
import appInfo from "./utils/appInfo";
import getInstalledApplications from "./utils/appInfo";

dotenv.config();

const app = express();
const port = process.env.port;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors(corsOptions));
app.use(limiter); // Apply the rate limiter to all routes
app.use(express.json());
app.use(router);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
myEventListener();
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, async () => {
  try {
    const db = await dbObj;
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to the database");
  }
  logger.info(`Server running at http://localhost:${port}`);
});
