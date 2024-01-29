import { WHATSAPP_APPLICATION_ID } from "@/models/constants";
import axios from "axios";

const WHATAPP_URL = "https://graph.facebook.com/v19.0";

const whatappCall = (
  uri: string,
  method: string = "GET",
  body?: Record<string, unknown>
) => {
  const config = {
    url: `${WHATAPP_URL}/${WHATSAPP_APPLICATION_ID}/` + uri,
    method,
    data: !!body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
  };

  return axios(config);
};

export async function sendWhatsAppBulkMessage({
  to,
  template,
}: {
  to: string;
  template: {
    name: string;
    language: string;
    parameters: string[];
  };
}) {
  const body = {
    messaging_product: "whatsapp",
    type: "template",
    template: {
      name: template.name,
      language: { code: template.language },
      components: [
        {
          type: "body",
          parameters: template.parameters.map((param) => ({
            type: "text",
            text: param,
          })),
        },
      ],
    },
  };

  try {
    await whatappCall("messages", "POST", body);
    return true;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return false;
  }
}

export async function getTemplates(
  {
    limit,
    name, // TODO
  }: {
    limit: number;
    name: string;
  } = { limit: 20, name: "" }
) {
  try {
    // TODO implement search by name for auto complete
    const fields = ["id", "components", "language", "name"];

    const response = await whatappCall(
      `message_templates?fields=${fields}&category=MARKETING&limit=${limit}`
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}
