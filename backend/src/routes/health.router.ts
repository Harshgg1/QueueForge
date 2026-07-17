import {Router} from "express";
const healthrouter = Router();

healthrouter.get("/health", (req, res) => {
  res.status(200).json({ status: "working.." });
});

export default healthrouter;