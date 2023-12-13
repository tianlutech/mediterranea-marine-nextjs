import * as google from "./google.api"

export async function POST(request: Request) {
  try {
    // Ensure the Content-Type is 'application/json' for correct parsing
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error("Invalid Content-Type");
    }
    const body = await request.json();
    const address = body.address;

    const response = await google.validateAddressZipCode(address)

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Please enter more specific address:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}