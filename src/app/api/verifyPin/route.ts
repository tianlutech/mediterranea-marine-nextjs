import * as verify from "./verifyPin.api";

export async function POST(request: Request) {
  try {
    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error("Invalid Content-Type");
    }
    const body = await request.json();
    const captainId = body.captainId;
    const Pin = body.Pin;

    const response = await verify.verifyPin(captainId, Pin);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    // TODO  Not valid address shall not fire an exception but be handle in the if
    console.error("Please enter more specific address:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
