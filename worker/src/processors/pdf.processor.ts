import { processPdf } from "../services/pdf.service";
export async function pdfProcessor(jobRecord:any){

    return processPdf(jobRecord);

}