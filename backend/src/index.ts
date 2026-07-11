import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { initSocket } from "./socket/socket";
import { initQueueEvents } from "./lib/queueEvents";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initSocket(server);
initQueueEvents();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
