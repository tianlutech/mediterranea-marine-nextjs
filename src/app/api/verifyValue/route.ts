import * as verify from "./verifyValue.api";

export async function POST(request: Request) {
  try {
    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error("Invalid Content-Type");
    }
    const body = await request.json();
    const key = body.key;
    const Pin = body.Pin;

    if(!key) {
      const response = await verify.verifyMasterValue(Pin);
      return response
    }
    const response = await verify.verifyValue(key, Pin);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("There has been an error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
