import { WhatsappTemplate } from "@/models/whatsapp";
import { toast } from "react-toastify";
import { Readable } from "stream";

export async function sendMessage(
  to: string,
  template: {
    name: string;
    language: string;
    parameters: string[];
    attachment?: { url: string; type: string };
  }
) {
  to = to.replace(/^00/, "+");

  try {
    const response = await fetch("/api/whatsApp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, template }),
    });
    const res = await response.json();
    if (res.error?.status === 400) {
      return { error: "We coudn't read the multimedia file" };
    }
    if (res.error) {
      return { error: res.error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Error while sending message", error);
    return { error };
  }
}

export async function getMessagesTemplates() {
  try {
    const response = await fetch("/api/whatsApp");
    const res = await response.json();

    if (res.error) {
      toast.error("Error uploading whatsapp templates: " + res.error);
    }

    return (res.data || []) as WhatsappTemplate[];
  } catch (error) {
    console.error("Error while getting templates", error);
    return [];
  }
}
