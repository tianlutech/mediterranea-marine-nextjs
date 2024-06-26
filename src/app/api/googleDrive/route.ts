import {  drive_v3  } from "googleapis";
import * as googleDrive from "./googleDrive.api";
import * as Sentry from "@sentry/nextjs";

interface Config {
  type: string;
  idCard: () => Promise<drive_v3.Schema$File | { error: any }>;
  receipt: () => Promise<drive_v3.Schema$File | { error: any }>;
}


// Define the function to handle the POST request
export async function POST(request: Request) {
  try {
    // Parse the incoming request to get the FormData
    const data = await request.formData();
    // Get the file from the FormData
    const file: File = data.get("file") as File;
    const type = data.get("type") as string;

    const body: any = {
      boatName: data.get("boatName"),
      id: data.get("id"),
      slag: data.get("slag"),
      date: data.get("date"),
    };

    if (!type) {
      return new Response(JSON.stringify({ message: "Type is required" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If there's no file in the FormData, return an error response
    if (!file) {
      return new Response(JSON.stringify({ message: "Not file found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const config: any = {
      idCard: () => googleDrive.uploadFile(file, body),
      receipt: () => googleDrive.uploadReceiptImage(file, body),
      customerSignature: () => googleDrive.uploadSignatureImage(file, body),
    };

    if (!config[type]) {
      return new Response(
        JSON.stringify({ message: "No action config for this type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await config[type]();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
