import { getCheckoutId } from "./sumup.api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;
    const response = await getCheckoutId(amount)

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    console.error("Error while processing your payment", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}