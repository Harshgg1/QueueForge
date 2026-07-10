import { imageProcessor } from "./image.processor";
import { pdfProcessor } from "./pdf.processor";
import { csvProcessor } from "./csv.processor";
import { Job} from "bullmq";
import { JobType } from "@prisma/client";

type Processor = (jobRecord: any, job: any) => Promise<any>;

const processors: Record<JobType, Processor> = {
    IMAGE: imageProcessor,
    PDF: pdfProcessor,
    CSV: csvProcessor,
};
export function getProcessor(type: JobType){

    return processors[type];

}