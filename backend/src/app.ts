import express from "express";
import cors from "cors";
import healthrouter from "./routes/health.router";
import jobRouter from "./routes/job.routes";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!, "https://queue-forge-kohl.vercel.app/"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/", healthrouter);

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/uploads", express.static("uploads"));

export default app;