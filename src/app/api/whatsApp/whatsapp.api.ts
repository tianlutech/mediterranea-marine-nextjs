import { WHATSAPP_APPLICATION_ID, WHATSAPP_PHONE_ID } from "@/models/constants";
import axios from "axios";

const WHATAPP_URL = "https://graph.facebook.com/v19.0";

const whatappCall = (
  uri: string,
  method: string,
  ID: string,
  body?: Record<string, unknown>
) => {
  const config = {
    url: `${WHATAPP_URL}/${ID}/` + uri,
    method,
    data: !!body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
  };
  return axios(config);
};

export async function sendMessage({
  to,
  template,
}: {
  to: string;
  template: {
    name: string;
    language: string;
    parameters: string[];
    attachment: { type: string; url: string };
  };
}) {
  const body = {
    messaging_product: "whatsapp",
    to,
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
      ] as Array<Record<string, unknown>>,
    },
  };

  if (template.attachment) {
    body.template.components.unshift({
      type: "header",
      parameters: [
        {
          type: template.attachment.type.toLowerCase(),
          [template.attachment.type.toLocaleLowerCase()]: {
            link: template.attachment.url,
            // Optional
            // provider: {
            //   name: "provider-name",
            // },
          },
        },
      ],
    });
  }
  try {
    const response = await whatappCall(
      "messages",
      "POST",
      WHATSAPP_PHONE_ID,
      body
    );
    return response.data;
  } catch (error) {
    return { error };
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
      `message_templates?fields=${fields}&category=MARKETING&limit=${limit}`,
      "GET",
      WHATSAPP_APPLICATION_ID
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}
