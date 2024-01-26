import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { Readable } from "stream";

export async function sendWhatsAppBulkMessage(body: any) {
  const buffer = Buffer.from(await body.file.arrayBuffer());

  const readCSV = async (filename: string): Promise<{ name: string; telephone: string }[]> => {
    const rows: { name: string; telephone: string }[] = [];

    // Use fs.promises to read the file asynchronously
    const stream = fs.createReadStream(filename).pipe(csvParser({ delimiter: ";" }));

    // Return a promise to handle the asynchronous file reading
    return new Promise((resolve, reject) => {
      stream
        .on("data", (row: any) => {
          // Assuming the CSV has columns named "name" and "telephone"
          const { name, telephone } = row;
          rows.push({ name, telephone });
        })
        .on("end", () => {
          resolve(rows);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  };

  try {
    console.log(">>>>>>>>file", Readable.from(buffer))
    const filename = body.file.path; // Assuming "body.file" contains information about the uploaded file
    const data = await readCSV(filename);
    
    console.log("CSV Data:", data);

    // Continue with processing the data as needed

    return true;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return false;
  }
}
