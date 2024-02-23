import * as verify from "./verifyValue.api";

export async function POST(request: Request): Promise<Response> {
  try {
    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Invalid Content-Type" }), { status: 400 });
    }

    const body = await request.json();
    const key = body.key;
    const Pin = body.Pin;

    let response;
    if (!key) {
      // Assuming verifyMasterValue returns an object or boolean, not a Response
      const result = await verify.verifyMasterValue(Pin);
      response = new Response(JSON.stringify(result), { status: 200 });
    } else {
      // Assuming verifyValue returns an object or boolean, not a Response
      const result = await verify.verifyValue(key, Pin);
      response = new Response(JSON.stringify(result), { status: 200 });
    }

    return response;
  } catch (error) {
    console.error("There has been an error:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
