import { WhatsappTemplate } from "@/models/whatsapp";
import csvParser from "csv-parser";
import { Readable } from "stream";

export async function sendBulkWhatsAppMessage(file: File, message: string) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(">>>>>>>buffer", buffer);

    const response = await fetch("/api/whatsApp", {
      method: "POST",
      body: formData,
    });
    const res = await response.json();
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
