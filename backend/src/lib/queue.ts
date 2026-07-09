import {Queue} from "bullmq";
import redisClient from "./redis";

const jobQueue = new Queue("job-queue", {
  connection: redisClient,
});

export default jobQueue;