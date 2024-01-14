import { IDentityResult } from "@/models/eden-ia";
import axios from "axios";

const edenAIApiKey = process.env.EDEN_API_KEY;

const EDEN_URL = "https://api.edenai.run/v2";

export async function validateIdentity(file: File) {
  const form = new FormData();
  form.append("providers", "amazon");
  form.append("file", file);

  try {
    const response = await axios.post<IDentityResult>(
      `${EDEN_URL}/ocr/identity_parser`,
      form,
      {
        headers: {
          Authorization: `Bearer ${edenAIApiKey}`,
          "Content-Type": "multipart/form-data;",
        },
      }
    );

    return response.data["eden-ai"];
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}
