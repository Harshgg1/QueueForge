import express from "express";
import cors from "cors";
import healthrouter from "./routes/health.router";
import jobRouter from "./routes/job.routes";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", healthrouter);

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);

export default app;
