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

    if(!captainId) {
      const response = await verify.verifyMasterPin(Pin);
      return response
    }
    const response = await verify.verifyCaptainPin(captainId, Pin);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("There has been an error:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
