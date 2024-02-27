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

    if (!response.data["eden-ai"]) {
      // The error come on the providers
      const error = Object.keys(response.data)
        .map(
          (provider) =>
            response.data[provider as keyof IDentityResult]?.error?.message
        )
        .filter((error) => !!error)
        .join(", ");

      return { error };
    }
    return response.data["eden-ai"];
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function validateIdentityUsingOCR(file: File) {
  console.log(">>>>got here");
  const form = new FormData();
  form.append("providers", "amazon");
  form.append("file", file);
  form.append("language", "en");

  try {
    const response = await axios.post(`${EDEN_URL}/ocr/ocr`, form, {
      headers: {
        Authorization: `Bearer ${edenAIApiKey}`,
        "Content-Type": "multipart/form-data;",
      },
    });
    console.log(">>>>>>", response);

    if (!response.data["eden-ai"]) {
      // The error come on the providers
      const error = Object.keys(response.data)
        .map(
          (provider) =>
            response.data[provider as keyof IDentityResult]?.error?.message
        )
        .filter((error) => !!error)
        .join(", ");

      return { error };
    }
    return response.data["eden-ai"];
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}
