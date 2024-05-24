import { v4 as uuidv4 } from "uuid";

const pay_to_email = process.env.PAY_TO_EMAIL;
const secret_key = process.env.SUMUP_SECRET_KEY;
export async function getCheckoutId({
  amount,
  description,
}: {
  description: string;
  amount: string;
}) {
  const referenceId = uuidv4();
  try {
    const apiUrl = "https://api.sumup.com/v0.1/checkouts";

    const response = await fetch(apiUrl, {
      // Ensure the path is correct based on your file structure
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret_key}`,
      },
      body: JSON.stringify({
        checkout_reference: referenceId,
        amount,
        currency: "EUR",
        pay_to_email: pay_to_email,
        description,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error: unknown) {
    console.error("Error while processing payment", (error as Error).message);
    return { error: (error as Error).message };
  }
}
