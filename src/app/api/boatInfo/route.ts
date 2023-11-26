import { Client } from "@notionhq/client";

const notionDatabaseId: string | undefined = process.env.NOTION_DATABASE_ID;
const notionSecret: string | undefined = process.env.NOTION_SECRET;

// Initialize a new client with the secret
const notion = new Client({ auth: notionSecret });

export async function GET(request: Request) {
  if (!notionDatabaseId || !notionSecret ) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const notion = new Client({ auth: notionSecret });

  try {
    const page = await notion.pages.retrieve({ page_id: "5ee487d0-93fd-4bfb-8d0c-a7e715b409f7" });
    return new Response(JSON.stringify(page), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

