import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import setHeadersOrigin from "../src/helpers/setHeadersOrigin";
import handleErrors from "../src/helpers/handleErrors";
import connectDB from "../src/db/connect_db";
import authRoutes from "../src/routes/auth";
import refreshTokenRoutes from "../src/routes/refreshToken";
import usersRoutes from "../src/routes/users";
import logger from "../src/logger/index";
import { authenticate, authAdmin } from "./middlewares/authenticated";
const session = require("express-session");
const passport = require("passport");
import onboardingRoutes from "../src/routes/onboardingRoutes";

dotenv.config();
const app = express();
const port: number = parseInt(process.env.PROJECT_PORT || "5050", 10);

// middlewares

app.use(express.urlencoded({ extended: false }));
app.use(setHeadersOrigin);
app.use(express.json());
app.use(cookieParser());
let publicDir: string = path.join(__dirname, "public"); // just concat the public to __dirname(url) => relative
// let publicDir: string = path.resolve(__dirname, "public"); // this is  public to root of server => absolute
app.use(express.static(publicDir));
// app.use('/static', express.static(publicDir));
// app.use('/media', express.static(publicDir));
app.use(handleErrors);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.get("/", async (req: Request, res: Response) => {
  res.json({ msg: "Home Page" });
});
app.use("/auth", authRoutes);
app.use("/refresh-token", refreshTokenRoutes);
app.use("/api", onboardingRoutes);

// app.use(authenticate); // all below routes must be authenticated
app.use("/api", usersRoutes);

// 404 page
app.get("*", (req: Request, res: Response) => {
  res.send("404 not found page");
});

// start app
app.listen(port, () => {
  logger.info(`server is running on port ${port}`);
  connectDB();
});
