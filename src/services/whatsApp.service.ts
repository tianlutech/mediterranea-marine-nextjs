import { WhatsappTemplate } from "@/models/whatsapp";
import { Readable } from "stream";

export async function sendMessage(
  to: string,
  template: { name: string; language: string; parameters: string[] }
) {
  try {
    console.log(">>>>got here")
    return true;
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
