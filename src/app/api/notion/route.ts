import * as notion from "./notion.api";

export async function GET(request: Request, params: { id: string }) {
  try {
    const result = notion.getPage(params.id);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  params: { pageId: string; properties: Record<string, unknown> }
) {
  try {
    const page = notion.updatePage(params.pageId, params.properties);
    return new Response(JSON.stringify(page), { status: 200 });
  } catch (error) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
