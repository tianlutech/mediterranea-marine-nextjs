import * as pdfMonkey from "./pdfMonkey.api";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await pdfMonkey.createDocument(data)

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    console.error("Error while creating document", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
