import { google } from "googleapis"
import * as googleDrive from "./googleDrive.api"
import { FileBody } from "@/app/models/models";

import { credentials } from "@/app/config/credentials"

const auth = new google.auth.GoogleAuth({
  // your credentials to authenticate
  // keyFile: process.cwd() + "/src/app/config/credentials.json",
  credentials: credentials,
  // the actions you are permissed to perform using this API, in this case
  // all CRUD operations are permissed, check out
  // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
  // for more advice on scopes
  scopes: ["https://www.googleapis.com/auth/drive"],
})
// Define the function to handle the POST request
export async function POST(request: Request) {
  try {
    // Parse the incoming request to get the FormData
    const data = await request.formData();
    // Get the file from the FormData
    const file: File = data.get("file") as File;
    // @abel am using the FileBody type but gives me errors
    const body: any = {
      boatName: data.get("boatName"),
      id: data.get("id"),
      slag: data.get("slag"),
    }

    // If there's no file in the FormData, return an error response
    if (!file) {
      return new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call your function to handle the file upload
    const result = await googleDrive.uploadFile(auth, file, body);
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