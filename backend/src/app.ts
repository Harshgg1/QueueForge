import express from "express";
import cors from "cors";
import healthrouter from "./routes/health.router";
import jobRouter from "./routes/job.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", healthrouter);
app.use(jobRouter);

export default app;
