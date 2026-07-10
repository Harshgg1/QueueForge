import { Job } from "bullmq";
import { processImage } from "../services/image.service";
export async function imageProcessor(jobRecord:any, job: Job){

    return processImage(jobRecord, job);

}