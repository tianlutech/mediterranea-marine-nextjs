import * as whatsapp from "./whatsapp.api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await whatsapp.sendWhatsAppBulkMessage(body);

    // Make sure to create a new Response object instead of modifying the original one
    const jsonResponse = new Response(JSON.stringify(response), {
      status: 200,
    });

    return jsonResponse;
  } catch (error) {
    // TODO: Not valid address shall not fire an exception but be handled in the if
    console.error("Message not sent", error);

    // Again, create a new Response object instead of modifying the original one
    const errorResponse = new Response(JSON.stringify(error), { status: 500 });

    return errorResponse;
  }
}

export async function GET(request: Request) {
  try {
    const response = await whatsapp.getTemplates();

    // Make sure to create a new Response object instead of modifying the original one
    const jsonResponse = new Response(JSON.stringify(response), {
      status: 200,
    });

    return jsonResponse;
  } catch (error) {
    // TODO: Not valid address shall not fire an exception but be handled in the if
    console.error("Error calling get templates", error);

    // Again, create a new Response object instead of modifying the original one
    const errorResponse = new Response(JSON.stringify(error), { status: 500 });

    return errorResponse;
  }
}
