import express from "express";
import cors from "cors";
import healthrouter from "./routes/health.router";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", healthrouter);

export default app;
