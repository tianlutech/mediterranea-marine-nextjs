import { WhatsappTemplate } from "@/models/whatsapp";
import { Readable } from "stream";

export async function sendMessage(
  to: string,
  template: {
    name: string; 
    language: string; 
    parameters: string[] 
  }
) {
  try {
    const response = await fetch(
      "/api/whatsApp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, template })
      }
    );
    const res = await response.json();
    return res
  } catch (error) {
    console.error("Error while sending message", error);
    return false;
  }
}

export async function getMessagesTemplates() {
  try {
    const response = await fetch("/api/whatsApp");
    const res = await response.json();

    return res.data as WhatsappTemplate[];
  } catch (error) {
    console.error("Error while getting templates", error);
    return [];
  }
}
