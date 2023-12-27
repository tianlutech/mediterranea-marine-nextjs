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
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

// Next.js API route to handle PUT requests
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pageId = url.searchParams.get("id");

    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error("Invalid Content-Type");
    }

    // Use request.json() to parse the request body as JSON
    const body = await request.json();
    const properties = body.properties;

    // Make sure that pageId and properties are defined
    if (!pageId || !properties) {
      throw new Error("Missing pageId or properties");
    }

    const page = await notion.updatePage(pageId, properties);
    return new Response(JSON.stringify(page), { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify({ error: error?.message || error }), {
      status: 500,
    });
  }
}
