import * as notion from "../notion.api";
import { deleteUndefined } from "@/services/utils";

// A complex GET where we pass the filter as a body
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const databaseId = url.searchParams.get("databaseId");
    const filterString = url.searchParams.get("filter");

    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Invalid Content Type" }), {
        status: 400,
      });
    }

    // Make sure that pageId and properties are defined
    if (!databaseId) {
      return new Response(JSON.stringify({ error: "Missing databaseId" }), {
        status: 404,
      });
    }

    // Use request.json() to parse the request body as JSON
    const query = {
      databaseId,
      filter: filterString ? JSON.parse(filterString) : undefined,
    };
    deleteUndefined(query);
    const response = await notion.queryDatabase(query);

    return new Response(
      JSON.stringify({ results: response.result?.results || [] }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify({ error: error?.message || error }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const databaseId = url.searchParams.get("databaseId");

    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Invalid Content Type" }), {
        status: 400,
      });
    }

    // Make sure that pageId and properties are defined
    if (!databaseId) {
      return new Response(JSON.stringify({ error: "Missing databaseId" }), {
        status: 404,
      });
    }

    // Use request.json() to parse the request body as JSON
    const body = await request.json();
    const properties = body || {};

    const response = await notion.createDatabaseItem({
      databaseId,
      properties,
    });
    if (response.error) {
      return new Response(JSON.stringify({ error: response.error }), {
        status: 424,
      });
    }
    return new Response(JSON.stringify({ result: response.result }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error retrieving page from Notion:", error);
    return new Response(JSON.stringify({ error: error?.message || error }), {
      status: 500,
    });
  }
}
