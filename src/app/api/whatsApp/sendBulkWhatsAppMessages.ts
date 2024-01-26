import csvParser from "csv-parser";
import { Readable } from "stream";
import axios from "axios";

const WHATAPP_URL = "https://graph.facebook.com/v18.0"

export async function sendWhatsAppBulkMessage(body: any) {
  const buffer = Buffer.from(await body.file.arrayBuffer());

  const readCSV = async (buffer: Buffer): Promise<{ name: string; telephone: string }[]> => {
    const rows: { Name: string; Telephone: string }[] = [];

    // Create a Readable stream from the buffer
    const stream = Readable.from(buffer).pipe(csvParser({ delimiter: ";" }));

    // Return a promise to handle the asynchronous file reading
    return new Promise((resolve, reject) => {
      stream
        .on("data", (col) => {
          // Assuming the CSV has columns named "name" and "telephone"
          const { Name, Telephone } = col;
          rows.push({ Name, Telephone });
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
    const data = await readCSV(buffer);

    console.log("CSV Data:", data);

    // Continue with processing the data as needed

    return true;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return false;
  }
}
