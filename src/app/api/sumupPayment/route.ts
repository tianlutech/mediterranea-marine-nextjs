import { getCheckoutId } from "./sumup.api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount;
    const description = body.description;
    if (!amount || !description) {
      return new Response(
        JSON.stringify({ error: "Amount and description and required fields" }),
        { status: 422 }
      );
    }
    const response = await getCheckoutId({ description, amount });
    if (response.error_code) {
      return new Response(
        JSON.stringify({
          error: `${response.error_code}: ${response.message} ${
            response.param || ""
          } `,
          original: response,
        }),
        { status: 424 }
      );
    }
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error: any) {
    console.error("Error while processing your payment", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
