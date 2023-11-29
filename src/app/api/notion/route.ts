import * as notion from "./notion.api";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id"); // Extracting the 'id' from the query parameters

  try {
    if (!id) {
      throw new Error("ID parameter is missing");
    }
    const result = await notion.getPage(id); // Make sure getPage is an async function or remove await
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
