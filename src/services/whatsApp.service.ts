import csvParser from "csv-parser";
import { Readable } from "stream";

export async function sendBulkWhatsAppMessage(file: File, message: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

    const readCSV = async (buffer: Buffer): Promise<{ Name: string; Telephone: string }[]> => {
      const rows: { Name: string; Telephone: string }[] = [];

      // Create a Readable stream from the buffer
      const stream = Readable.from(buffer).pipe(csvParser({ delimiter: "," }));
      console.log(">>>>>>stream", stream)

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

    // data.map(async (item) => {
    //     await fetch(
    //         "/api/whatsApp",
    //         {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 message,
    //                 phone: item.telephone,
    //             }),
    //         }
    //     );
    // });

    return true;
} catch (error) {
  console.error("Error while sending message", error);
    return false;
}}