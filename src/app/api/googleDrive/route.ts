import { google, drive_v3  } from "googleapis";
import * as googleDrive from "./googleDrive.api";
import { credentials } from "../config/credentials";

interface Config {
  type: string;
  idCard: () => Promise<drive_v3.Schema$File | { error: any }>;
  receipt: () => Promise<drive_v3.Schema$File | { error: any }>;
}
const auth = new google.auth.GoogleAuth({
  // your credentials to authenticate
  // keyFile: process.cwd() + "/src/app/config/credentials.json",
  credentials: credentials,
  // the actions you are permissed to perform using this API, in this case
  // all CRUD operations are permissed, check out
  // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
  // for more advice on scopes
  scopes: ["https://www.googleapis.com/auth/drive"],
});

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

    // @abel here added the type but am still getting a type error I sued any
    const config: any = {
      idCard: () => googleDrive.uploadFile(auth, file, body),
      receipt: () => googleDrive.uploadReceiptImage(auth, file),
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
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
