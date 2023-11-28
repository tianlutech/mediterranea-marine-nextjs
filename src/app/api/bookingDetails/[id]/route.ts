import { Booking } from "@/app/models/models";
import {
  NotionPage,
  parseNotionObject,
  parseObjectToNotion,
} from "@/app/models/notion.model";
import { Client } from "@notionhq/client";

const notionDatabaseId: string | undefined = process.env.NOTION_DATABASE_ID;
const notionSecret: string | undefined = process.env.NOTION_SECRET;

// Initialize a new client with the secret
const notion = new Client({ auth: notionSecret });

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!notionDatabaseId || !notionSecret) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const notion = new Client({ auth: notionSecret });
  const id = params.id;

  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const booking = parseNotionObject<Booking>(page as NotionPage);

    return new Response(JSON.stringify({ booking }), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!notionDatabaseId || !notionSecret) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const notion = new Client({ auth: notionSecret });
  const id = params.id;
  const data = await request.json();

  try {
    const page = await notion.pages.update({
      page_id: id,
      properties: { data },
    });

    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
