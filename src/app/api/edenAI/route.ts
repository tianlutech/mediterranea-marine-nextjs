import * as edenAI from "./edenAI.api";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File = data.get("file") as File;

    const response = await edenAI.validateIdentityUsingOCR(file);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Failed to validate your image", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
