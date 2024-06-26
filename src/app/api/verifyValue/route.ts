import * as verify from "./verifyValue.api";
import * as Sentry from "@sentry/nextjs";
 
export async function POST(request: Request): Promise<Response> {
  try {
    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Invalid Content-Type" }), {
        status: 400,
      });
    }

    const body = await request.json();
    const itemID = body.itemID;
    const value = body.value;
    const compareTo = body.compareTo;

    if (compareTo === "MasterKey") {
      const result = await verify.verifyMasterValue(value);
      return new Response(JSON.stringify(result), { status: 200 });
    }
    // Assuming verifyValue returns an object or boolean, not a Response
    const result = await verify.verifyValue({ itemID, value, compareTo });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);

    console.error("There has been an error:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
